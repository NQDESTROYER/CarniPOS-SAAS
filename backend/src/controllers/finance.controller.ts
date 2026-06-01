import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const ShiftController = {
  // Apertura de Turno
  async openShift(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      monto_apertura: z.number().default(0),
    });

    const { monto_apertura } = schema.parse(request.body);

    const shift = await prisma.turnoCaja.create({
      data: {
        tenant_id: request.tenantId,
        usuario_id: request.userId,
        monto_apertura,
        total_esperado_efectivo: monto_apertura,
      }
    });

    return reply.status(201).send(shift);
  },

  // Cierre de Turno (Arqueo)
  async closeShift(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      id: z.string(),
      fisico_declarado: z.number(),
    });

    const { id, fisico_declarado } = schema.parse(request.body);

    const shift = await prisma.turnoCaja.findUnique({
      where: { id, tenant_id: request.tenantId }
    });

    if (!shift || shift.estado === 'CERRADO') throw new Error('Turno no encontrado o ya cerrado');

    const descuadre = fisico_declarado - shift.total_esperado_efectivo;

    const closedShift = await prisma.turnoCaja.update({
      where: { id },
      data: {
        estado: 'CERRADO',
        fecha_fin: new Date(),
        fisico_declarado,
        descuadre,
      }
    });

    return reply.send(closedShift);
  }
};

export const CustomerController = {
  // Recaudación de Pagos (Abonos a Fiados)
  async addPayment(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      cliente_id: z.string(),
      turno_id: z.string(),
      monto: z.number(),
      metodo: z.enum(['EFECTIVO', 'TRANSFERENCIA']),
    });

    const { cliente_id, turno_id, monto, metodo } = schema.parse(request.body);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Registrar el Abono en el Estado de Cuenta
      const abono = await tx.estadoCuenta.create({
        data: {
          tenant_id: request.tenantId,
          cliente_id,
          tipo: metodo === 'EFECTIVO' ? 'ABONO_EFECTIVO' : 'ABONO_TRANSFERENCIA',
          monto,
          descripcion: `Pago de deuda - ${metodo}`,
        }
      });

      // 2. Liberar Crédito del Cliente
      await tx.cliente.update({
        where: { id: cliente_id },
        data: {
          deuda_total: { decrement: monto },
          credito_disponible: { increment: monto }
        }
      });

      // 3. Si es Efectivo, sumar a la caja (pero separado de ventas del día)
      if (metodo === 'EFECTIVO') {
        await tx.turnoCaja.update({
          where: { id: turno_id },
          data: {
            total_abonos_fiados: { increment: monto },
            total_esperado_efectivo: { increment: monto }
          }
        });
      }

      return abono;
    });

    return reply.send(result);
  },

  async listCustomers(request: FastifyRequest) {
    return prisma.cliente.findMany({
      where: { tenant_id: request.tenantId }
    });
  }
};

import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const POSController = {
  // Procesamiento de Venta con Transacción ACID
  async createVenta(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      turno_id: z.string(),
      cliente_id: z.string().optional(),
      canal_venta: z.enum(['VITRINA', 'MAYORISTA', 'CANAL_ENTERO']),
      metodo_pago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'FIAR']),
      items: z.array(z.object({
        producto_id: z.string(),
        cantidad_kg: z.number(),
      })),
    });

    const body = schema.parse(request.body);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Verificar que el turno esté abierto
      const turno = await tx.turnoCaja.findUnique({
        where: { id: body.turno_id, tenant_id: request.tenantId },
      });

      if (!turno || turno.estado === 'CERRADO') throw new Error('Turno de caja no válido o cerrado');

      let totalVenta = 0;
      const detallesData = [];

      // 2. Validar Precios y Stock
      for (const item of body.items) {
        const precioCanal = await tx.precioCanal.findUnique({
          where: {
            tenant_id_producto_id_canal: {
              tenant_id: request.tenantId,
              producto_id: item.producto_id,
              canal: body.canal_venta,
            }
          }
        });

        if (!precioCanal) throw new Error(`Precio no definido para el producto ${item.producto_id} en canal ${body.canal_venta}`);

        const subtotal = Math.round(item.cantidad_kg * precioCanal.precio_kilo);
        totalVenta += subtotal;

        detallesData.push({
          tenant_id: request.tenantId,
          producto_id: item.producto_id,
          cantidad_kg: item.cantidad_kg,
          precio_unitario: precioCanal.precio_kilo,
          subtotal,
        });

        // Descontar Stock
        await tx.producto.update({
          where: { id: item.producto_id, tenant_id: request.tenantId },
          data: { stock_actual: { decrement: item.cantidad_kg } }
        });

        // Auditoría Stock
        await tx.movimientoInventario.create({
          data: {
            tenant_id: request.tenantId,
            producto_id: item.producto_id,
            cantidad: item.cantidad_kg,
            tipo: 'SALIDA_VENTA',
          }
        });
      }

      // 3. Gestionar Método de Pago: FIADO
      if (body.metodo_pago === 'FIAR') {
        if (!body.cliente_id) throw new Error('Se requiere cliente para ventas al fiado');
        
        const cliente = await tx.cliente.findUnique({
          where: { id: body.cliente_id, tenant_id: request.tenantId }
        });

        if (!cliente || cliente.credito_disponible < totalVenta) {
          throw new Error('Crédito insuficiente o cliente no encontrado');
        }

        // Aumentar deuda
        await tx.cliente.update({
          where: { id: body.cliente_id },
          data: {
            deuda_total: { increment: totalVenta },
            credito_disponible: { decrement: totalVenta }
          }
        });

        // Historial Estado de Cuenta
        await tx.estadoCuenta.create({
          data: {
            tenant_id: request.tenantId,
            cliente_id: body.cliente_id,
            tipo: 'CARGO_POR_VENTA',
            monto: totalVenta,
            descripcion: `Venta POS #${body.canal_venta}`,
          }
        });
      } else if (body.metodo_pago === 'EFECTIVO') {
        // Si es efectivo, sumar al esperado del turno
        await tx.turnoCaja.update({
          where: { id: body.turno_id },
          data: { 
            total_ventas_dia: { increment: totalVenta },
            total_esperado_efectivo: { increment: totalVenta }
          }
        });
      }

      // 4. Crear la Venta
      const venta = await tx.venta.create({
        data: {
          tenant_id: request.tenantId,
          turno_id: body.turno_id,
          cliente_id: body.cliente_id,
          canal_venta: body.canal_venta,
          metodo_pago: body.metodo_pago,
          total: totalVenta,
          detalles: {
            create: detallesData
          }
        },
        include: { detalles: true }
      });

      return venta;
    });

    return reply.status(201).send(result);
  }
};

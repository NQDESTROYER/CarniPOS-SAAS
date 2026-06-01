import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const InventoryController = {
  // 1. Ingreso de Reses (Lotes)
  async createLote(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      numero_caravana: z.string().optional(),
      peso_inicial: z.number(),
      costo_total: z.number(),
      calidad: z.enum(['A', 'B', 'C', 'V', 'U', 'N']).default('V'),
      proveedor: z.string().optional(),
    });

    const body = schema.parse(request.body);

    const lote = await prisma.lote.create({
      data: {
        ...body,
        tenant_id: request.tenantId,
        peso_actual: body.peso_inicial,
      },
    });

    return reply.status(201).send(lote);
  },

  // 2. Proceso de Desposte (Rendimiento)
  async processDesposte(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      lote_id: z.string(),
      detalles: z.array(z.object({
        producto_id: z.string(),
        cantidad_kg: z.number(),
      })),
      merma_total_kg: z.number(),
    });

    const { lote_id, detalles, merma_total_kg } = schema.parse(request.body);

    const result = await prisma.$transaction(async (tx) => {
      const lote = await tx.lote.findUnique({
        where: { id: lote_id, tenant_id: request.tenantId },
      });

      if (!lote) throw new Error('Lote no encontrado');
      if (lote.esta_despostado) throw new Error('Este lote ya fue despostado');

      // Calcular rendimiento
      const total_carne_kg = detalles.reduce((acc, d) => acc + d.cantidad_kg, 0);
      const rendimiento_pct = (total_carne_kg / Number(lote.peso_inicial)) * 100;

      // 1. Crear el registro de Desposte
      const desposte = await tx.desposte.create({
        data: {
          tenant_id: request.tenantId,
          lote_id,
          merma_total_kg,
          rendimiento_pct,
          detalles: {
            create: detalles.map(d => ({
              producto_id: d.producto_id,
              cantidad_kg: d.cantidad_kg,
            })),
          },
        },
      });

      // 2. Actualizar Stock de Productos e insertar Movimientos
      for (const d of detalles) {
        await tx.producto.update({
          where: { id: d.producto_id, tenant_id: request.tenantId },
          data: { stock_actual: { increment: d.cantidad_kg } },
        });

        await tx.movimientoInventario.create({
          data: {
            tenant_id: request.tenantId,
            producto_id: d.producto_id,
            cantidad: d.cantidad_kg,
            tipo: 'ENTRADA_DESPOSTE',
            referencia: desposte.id,
          },
        });
      }

      // 3. Marcar lote como despostado
      await tx.lote.update({
        where: { id: lote_id },
        data: { esta_despostado: true, peso_actual: 0 },
      });

      return { desposte, rendimiento_pct };
    });

    return reply.send(result);
  },

  async listLotes(request: FastifyRequest) {
    return prisma.lote.findMany({
      where: { tenant_id: request.tenantId },
      orderBy: { fecha_ingreso: 'desc' },
    });
  }
};

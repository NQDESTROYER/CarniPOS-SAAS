import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const CatalogController = {
  async getProducts(request: FastifyRequest) {
    const querySchema = z.object({
      canal: z.enum(['VITRINA', 'MAYORISTA', 'CANAL_ENTERO']).default('VITRINA'),
    });

    const { canal } = querySchema.parse(request.query);

    return prisma.producto.findMany({
      where: { tenant_id: request.tenantId },
      include: {
        preciosCanal: {
          where: { canal }
        },
        categoria: true
      }
    });
  },

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      nombre: z.string(),
      categoria_id: z.string(),
      sku: z.string().optional(),
      precios: z.array(z.object({
        canal: z.enum(['VITRINA', 'MAYORISTA', 'CANAL_ENTERO']),
        precio_kilo: z.number()
      }))
    });

    const body = schema.parse(request.body);

    const producto = await prisma.producto.create({
      data: {
        tenant_id: request.tenantId,
        nombre: body.nombre,
        categoria_id: body.categoria_id,
        sku: body.sku,
        preciosCanal: {
          create: body.precios.map(p => ({
            tenant_id: request.tenantId,
            ...p
          }))
        }
      }
    });

    return reply.status(201).send(producto);
  }
};

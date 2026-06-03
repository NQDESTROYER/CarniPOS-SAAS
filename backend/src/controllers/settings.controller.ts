import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const SettingsController = {
  async getSettings(request: FastifyRequest, reply: FastifyReply) {
    const tenant = await prisma.tenant.findUnique({ where: { id: request.tenantId } });
    if (!tenant) return reply.status(404).send({ message: 'Tenant not found' });
    return tenant;
  },

  async updateSettings(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({ nombre: z.string().min(1) });
    const body = schema.parse(request.body);
    
    const tenant = await prisma.tenant.update({
      where: { id: request.tenantId },
      data: { nombre: body.nombre }
    });
    return tenant;
  }
};

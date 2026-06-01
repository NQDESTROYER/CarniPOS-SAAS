import { FastifyReply, FastifyRequest } from 'fastify';
import { supabase } from '../lib/supabase';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return reply.status(401).send({ message: 'Invalid or expired token', error: error?.message });
  }

  // Extraer tenant_id de las metadata del usuario en Supabase
  const tenantId = user.user_metadata?.tenant_id;

  if (!tenantId) {
    return reply.status(403).send({ message: 'User not associated with any tenant' });
  }

  // Adjuntar tenant_id y user_id a la request para uso global
  request.tenantId = tenantId;
  request.userId = user.id;
}

// Extensión de tipos para Fastify
declare module 'fastify' {
  interface FastifyRequest {
    tenantId: string;
    userId: string;
  }
}

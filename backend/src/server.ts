import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { env } from './config/env';
import { authMiddleware } from './middlewares/auth.middleware';
import { InventoryController } from './controllers/inventory.controller';
import { POSController } from './controllers/pos.controller';
import { CatalogController } from './controllers/catalog.controller';
import { ShiftController, CustomerController } from './controllers/finance.controller';
import { SettingsController } from './controllers/settings.controller';

const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  // Plugins Core
  await fastify.register(helmet);
  await fastify.register(cors, {
    origin: true,
  });

  // Manejo de Errores Global
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
        details: error.validation
      });
    }

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;

    reply.status(statusCode).send({
      error: error.name || 'Error',
      message,
    });
  });

  // Health Check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Root Route
  fastify.get('/', async () => {
    return { message: 'CarniPOS API is running', version: '1.0.0' };
  });

  // API V1 - RUTAS PROTEGIDAS MULTI-TENANT
  fastify.register(async (api) => {
    api.addHook('preHandler', authMiddleware);

    // Módulo: Catálogo
    api.get('/products', CatalogController.getProducts);
    api.post('/products', CatalogController.createProduct);

    // Módulo: Inventario (Trazabilidad)
    api.get('/lotes', InventoryController.listLotes);
    api.post('/lotes', InventoryController.createLote);
    api.post('/desposte', InventoryController.processDesposte);

    // Módulo: POS (Ventas)
    api.post('/ventas', POSController.createVenta);

    // Módulo: Finanzas y Caja
    api.get('/caja/activo', ShiftController.getActiveShift);
    api.post('/caja/abrir', ShiftController.openShift);
    api.post('/caja/cerrar', ShiftController.closeShift);
    api.get('/clientes', CustomerController.listCustomers);
    api.post('/clientes', CustomerController.createCustomer);
    api.post('/clientes/pagar', CustomerController.addPayment);

    // Módulo: Configuración
    api.get('/settings', SettingsController.getSettings);
    api.patch('/settings', SettingsController.updateSettings);

    api.get('/me', async (request) => {
      return {
        userId: request.userId,
        tenantId: request.tenantId,
      };
    });
  }, { prefix: '/api/v1' });

  try {
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 CarniPOS API running on http://localhost:${env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();

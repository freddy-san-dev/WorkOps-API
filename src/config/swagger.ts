import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'WorkOps API',
      version: '1.0.0',
      description: 'Fictional API for field crews and work orders.',
    },
    servers: [{ url: 'http://localhost:3000/api/v1' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  apis: [join(process.cwd(), 'src/routes/*.ts'), join(currentDirectory, '../routes/*.js')],
});

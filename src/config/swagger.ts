import swaggerJsdoc from 'swagger-jsdoc';

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
  apis: ['./src/routes/*.ts'],
});

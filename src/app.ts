import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import crewRoutes from './routes/crew.routes.js';
import workOrderRoutes from './routes/work-order.routes.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'workops-api' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crews', crewRoutes);
app.use('/api/v1/work-orders', workOrderRoutes);
app.use(notFound);
app.use(errorHandler);

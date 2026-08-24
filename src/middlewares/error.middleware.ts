import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export const notFound: RequestHandler = (req, _res, next) =>
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;
  if (error instanceof ZodError)
    return res.status(400).json({ error: 'Validation error', details: error.issues });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
    return res.status(409).json({ error: 'A unique field value is already in use' });
  if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });
  if (env.NODE_ENV !== 'test') console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
};

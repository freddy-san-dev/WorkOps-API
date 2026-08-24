import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@prisma/client';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new AppError(401, 'Authentication token is required'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub || !payload.email || !payload.role)
      throw new AppError(401, 'Invalid authentication token');
    req.user = { id: payload.sub, email: payload.email as string, role: payload.role as UserRole };
    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError(401, 'Invalid or expired authentication token'),
    );
  }
};

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role))
      return next(new AppError(403, 'Insufficient permissions'));
    next();
  };

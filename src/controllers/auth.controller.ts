import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const service = new AuthService();
export const register = async (req: Request, res: Response) => {
  const result = await service.register(registerSchema.parse(req.body));
  res.status(201).json(result);
};
export const login = async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  res.json(await service.login(input.email, input.password));
};

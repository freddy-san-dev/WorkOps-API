import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';
import { env } from '../config/env.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/app-error.js';
import { sanitizeUser } from '../utils/serializers.js';

export class AuthService {
  private readonly users = new UserRepository();

  async register(data: { name: string; email: string; password: string; role?: UserRole }) {
    const email = data.email.toLowerCase();
    if (await this.users.findByEmail(email)) throw new AppError(409, 'Email is already registered');
    const password = await bcrypt.hash(data.password, 12);
    const user = await this.users.create({ ...data, email, password });
    return { user: sanitizeUser(user), token: this.createToken(user) };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new AppError(401, 'Invalid email or password');
    return { user: sanitizeUser(user), token: this.createToken(user) };
  }

  private createToken(user: { id: string; email: string; role: UserRole }) {
    return jwt.sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }
}

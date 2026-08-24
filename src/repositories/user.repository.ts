import type { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }
  listByRole(role: UserRole) {
    return prisma.user.findMany({ where: { role } });
  }
}

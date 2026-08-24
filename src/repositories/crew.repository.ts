import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const include = {
  supervisor: { select: { id: true, name: true, email: true } },
  _count: { select: { workOrders: true } },
};

export class CrewRepository {
  findAll() {
    return prisma.crew.findMany({ include, orderBy: { name: 'asc' } });
  }
  findById(id: string) {
    return prisma.crew.findUnique({ where: { id }, include });
  }
  create(data: Prisma.CrewUncheckedCreateInput) {
    return prisma.crew.create({ data, include });
  }
  update(id: string, data: Prisma.CrewUncheckedUpdateInput) {
    return prisma.crew.update({ where: { id }, data, include });
  }
  delete(id: string) {
    return prisma.crew.delete({ where: { id } });
  }
}

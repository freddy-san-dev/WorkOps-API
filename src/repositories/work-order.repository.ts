import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const include = {
  assignedCrew: { include: { supervisor: { select: { id: true, name: true, email: true } } } },
};

export class WorkOrderRepository {
  findById(id: string) {
    return prisma.workOrder.findUnique({ where: { id }, include });
  }
  async findMany(where: Prisma.WorkOrderWhereInput, skip: number, take: number) {
    const [items, total] = await prisma.$transaction([
      prisma.workOrder.findMany({ where, skip, take, include, orderBy: { createdAt: 'desc' } }),
      prisma.workOrder.count({ where }),
    ]);
    return { items, total };
  }
  create(data: Prisma.WorkOrderUncheckedCreateInput) {
    return prisma.workOrder.create({ data, include });
  }
  update(id: string, data: Prisma.WorkOrderUncheckedUpdateInput) {
    return prisma.workOrder.update({ where: { id }, data, include });
  }
  delete(id: string) {
    return prisma.workOrder.delete({ where: { id } });
  }
  countByStatus() {
    return prisma.workOrder.groupBy({ by: ['status'], _count: { _all: true } });
  }
}

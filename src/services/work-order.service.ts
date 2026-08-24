import type { Prisma, WorkOrderPriority, WorkOrderStatus } from '@prisma/client';
import { CrewRepository } from '../repositories/crew.repository.js';
import { WorkOrderRepository } from '../repositories/work-order.repository.js';
import { AppError } from '../utils/app-error.js';

type WorkOrderInput = {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  priority?: WorkOrderPriority;
  assignedCrewId?: string | null;
};
type WorkOrderFilters = {
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  crewId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  limit: number;
};

export class WorkOrderService {
  private readonly orders = new WorkOrderRepository();
  private readonly crews = new CrewRepository();
  async list(filters: WorkOrderFilters) {
    const where: Prisma.WorkOrderWhereInput = {
      status: filters.status,
      priority: filters.priority,
      assignedCrewId: filters.crewId,
    };
    if (filters.dateFrom || filters.dateTo)
      where.createdAt = { gte: filters.dateFrom, lte: filters.dateTo };
    const { items, total } = await this.orders.findMany(
      where,
      (filters.page - 1) * filters.limit,
      filters.limit,
    );
    return {
      data: items,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }
  async get(id: string) {
    const order = await this.orders.findById(id);
    if (!order) throw new AppError(404, 'Work order not found');
    return order;
  }
  async create(data: WorkOrderInput) {
    if (data.assignedCrewId) await this.ensureCrew(data.assignedCrewId);
    const orderNumber = `WO-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return this.orders.create({
      ...data,
      orderNumber,
      status: data.assignedCrewId ? 'ASSIGNED' : 'PENDING',
    });
  }
  async update(id: string, data: Partial<WorkOrderInput>) {
    await this.get(id);
    if (data.assignedCrewId) await this.ensureCrew(data.assignedCrewId);
    return this.orders.update(id, data);
  }
  async remove(id: string) {
    await this.get(id);
    await this.orders.delete(id);
  }
  async assignCrew(id: string, crewId: string) {
    await this.get(id);
    await this.ensureCrew(crewId);
    return this.orders.update(id, { assignedCrewId: crewId, status: 'ASSIGNED' });
  }
  async updateStatus(id: string, status: WorkOrderStatus) {
    const order = await this.get(id);
    if (!order.assignedCrewId && ['ASSIGNED', 'IN_PROGRESS'].includes(status))
      throw new AppError(400, 'Assign a crew before changing to this status');
    const now = new Date();
    return this.orders.update(id, {
      status,
      startedAt: status === 'IN_PROGRESS' && !order.startedAt ? now : undefined,
      completedAt: status === 'COMPLETED' ? now : undefined,
    });
  }
  async statistics() {
    const rows = await this.orders.countByStatus();
    const counts = Object.fromEntries(rows.map((row) => [row.status, row._count._all]));
    const total = rows.reduce((sum, row) => sum + row._count._all, 0);
    const completed = counts.COMPLETED ?? 0;
    return {
      total,
      pending: counts.PENDING ?? 0,
      inProgress: counts.IN_PROGRESS ?? 0,
      completed,
      completionRate: total ? Number(((completed / total) * 100).toFixed(2)) : 0,
    };
  }
  private async ensureCrew(id: string) {
    const crew = await this.crews.findById(id);
    if (!crew) throw new AppError(400, 'Crew not found');
    if (crew.status !== 'ACTIVE') throw new AppError(400, 'Crew is inactive');
  }
}

import { WorkOrderPriority, WorkOrderStatus } from '@prisma/client';
import { z } from 'zod';

const coordinates = z.object({
  latitude: z.coerce.number().gte(-90).lte(90),
  longitude: z.coerce.number().gte(-180).lte(180),
});

export const createWorkOrderSchema = z
  .object({
    title: z.string().trim().min(3).max(150),
    description: z.string().trim().min(5).max(2000),
    address: z.string().trim().min(5).max(250),
    priority: z.nativeEnum(WorkOrderPriority).optional(),
    assignedCrewId: z.string().cuid().nullable().optional(),
  })
  .merge(coordinates);

export const updateWorkOrderSchema = createWorkOrderSchema.partial();

export const assignCrewSchema = z.object({ crewId: z.string().cuid() });
export const updateWorkOrderStatusSchema = z.object({ status: z.nativeEnum(WorkOrderStatus) });

export const workOrderQuerySchema = z.object({
  status: z.nativeEnum(WorkOrderStatus).optional(),
  priority: z.nativeEnum(WorkOrderPriority).optional(),
  crewId: z.string().cuid().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

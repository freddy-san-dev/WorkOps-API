import type { Request, Response } from 'express';
import {
  assignCrewSchema,
  createWorkOrderSchema,
  updateWorkOrderSchema,
  updateWorkOrderStatusSchema,
  workOrderQuerySchema,
} from '../schemas/work-order.schema.js';
import { WorkOrderService } from '../services/work-order.service.js';
const service = new WorkOrderService();
export const listWorkOrders = async (req: Request, res: Response) =>
  res.json(await service.list(workOrderQuerySchema.parse(req.query)));
export const getWorkOrder = async (req: Request, res: Response) =>
  res.json({ data: await service.get(req.params.id as string) });
export const createWorkOrder = async (req: Request, res: Response) =>
  res.status(201).json({ data: await service.create(createWorkOrderSchema.parse(req.body)) });
export const updateWorkOrder = async (req: Request, res: Response) =>
  res.json({
    data: await service.update(req.params.id as string, updateWorkOrderSchema.parse(req.body)),
  });
export const deleteWorkOrder = async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(204).send();
};
export const assignCrew = async (req: Request, res: Response) =>
  res.json({
    data: await service.assignCrew(
      req.params.id as string,
      assignCrewSchema.parse(req.body).crewId,
    ),
  });
export const updateStatus = async (req: Request, res: Response) =>
  res.json({
    data: await service.updateStatus(
      req.params.id as string,
      updateWorkOrderStatusSchema.parse(req.body).status,
    ),
  });
export const statistics = async (_req: Request, res: Response) =>
  res.json({ data: await service.statistics() });

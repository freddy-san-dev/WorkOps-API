import type { Request, Response } from 'express';
import { createCrewSchema, updateCrewSchema } from '../schemas/crew.schema.js';
import { CrewService } from '../services/crew.service.js';
const service = new CrewService();
export const listCrews = async (_req: Request, res: Response) =>
  res.json({ data: await service.list() });
export const getCrew = async (req: Request, res: Response) =>
  res.json({ data: await service.get(req.params.id as string) });
export const createCrew = async (req: Request, res: Response) =>
  res.status(201).json({ data: await service.create(createCrewSchema.parse(req.body)) });
export const updateCrew = async (req: Request, res: Response) =>
  res.json({
    data: await service.update(req.params.id as string, updateCrewSchema.parse(req.body)),
  });
export const deleteCrew = async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(204).send();
};

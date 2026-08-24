import { CrewStatus } from '@prisma/client';
import { z } from 'zod';

export const createCrewSchema = z.object({
  name: z.string().trim().min(2).max(100),
  supervisorId: z.string().cuid().nullable().optional(),
  status: z.nativeEnum(CrewStatus).optional(),
});

export const updateCrewSchema = createCrewSchema.partial();

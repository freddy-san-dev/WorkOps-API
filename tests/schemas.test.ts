import { describe, expect, it } from 'vitest';
import { createWorkOrderSchema, workOrderQuerySchema } from '../src/schemas/work-order.schema.js';

describe('work order schemas', () => {
  it('accepts valid payloads', () =>
    expect(
      createWorkOrderSchema.parse({
        title: 'Streetlight inspection',
        description: 'Inspect lamp assembly at fictional address.',
        address: '14 Aurora Lane',
        latitude: -0.1807,
        longitude: -78.4678,
      }),
    ).toMatchObject({ title: 'Streetlight inspection', latitude: -0.1807 }));
  it('coerces pagination query parameters', () =>
    expect(workOrderQuerySchema.parse({ page: '2', limit: '20' })).toMatchObject({
      page: 2,
      limit: 20,
    }));
  it('rejects invalid coordinates', () =>
    expect(() =>
      createWorkOrderSchema.parse({
        title: 'Bad order',
        description: 'This description is long enough.',
        address: '14 Aurora Lane',
        latitude: 91,
        longitude: 0,
      }),
    ).toThrow());
});

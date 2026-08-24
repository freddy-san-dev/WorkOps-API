import { Router } from 'express';
import {
  assignCrew,
  createWorkOrder,
  deleteWorkOrder,
  getWorkOrder,
  listWorkOrders,
  statistics,
  updateStatus,
  updateWorkOrder,
} from '../controllers/work-order.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
const router = Router();
/**
 * @openapi
 * /work-orders:
 *   get:
 *     tags: [Work orders]
 *     security: [{ bearerAuth: [] }]
 *     summary: List work orders with filters and pagination
 *     parameters:
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: priority, schema: { type: string } }
 *       - { in: query, name: crewId, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *     responses: { '200': { description: Paginated work orders } }
 *   post:
 *     tags: [Work orders]
 *     security: [{ bearerAuth: [] }]
 *     summary: Create a work order
 *     responses: { '201': { description: Work order created } }
 * /work-orders/statistics:
 *   get:
 *     tags: [Work orders]
 *     security: [{ bearerAuth: [] }]
 *     summary: Get work order KPIs
 *     responses: { '200': { description: Statistics } }
 */
router.use(authenticate);
router.get('/', asyncHandler(listWorkOrders));
router.get('/statistics', asyncHandler(statistics));
router.get('/:id', asyncHandler(getWorkOrder));
router.post('/', authorize('ADMIN', 'SUPERVISOR'), asyncHandler(createWorkOrder));
router.patch('/:id', authorize('ADMIN', 'SUPERVISOR'), asyncHandler(updateWorkOrder));
router.patch('/:id/assign', authorize('ADMIN', 'SUPERVISOR'), asyncHandler(assignCrew));
router.patch(
  '/:id/status',
  authorize('ADMIN', 'SUPERVISOR', 'TECHNICIAN'),
  asyncHandler(updateStatus),
);
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteWorkOrder));
export default router;

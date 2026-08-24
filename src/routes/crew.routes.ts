import { Router } from 'express';
import {
  createCrew,
  deleteCrew,
  getCrew,
  listCrews,
  updateCrew,
} from '../controllers/crew.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
const router = Router();
/**
 * @openapi
 * /crews:
 *   get:
 *     tags: [Crews]
 *     security: [{ bearerAuth: [] }]
 *     summary: List field crews
 *     responses: { '200': { description: Crew list } }
 *   post:
 *     tags: [Crews]
 *     security: [{ bearerAuth: [] }]
 *     summary: Create a field crew (admin only)
 *     responses: { '201': { description: Crew created } }
 * /crews/{id}:
 *   get:
 *     tags: [Crews]
 *     security: [{ bearerAuth: [] }]
 *     summary: Get a crew by ID
 *     responses: { '200': { description: Crew found } }
 *   patch:
 *     tags: [Crews]
 *     security: [{ bearerAuth: [] }]
 *     summary: Update a field crew (admin only)
 *     responses: { '200': { description: Crew updated } }
 *   delete:
 *     tags: [Crews]
 *     security: [{ bearerAuth: [] }]
 *     summary: Delete a field crew (admin only)
 *     responses: { '204': { description: Crew deleted } }
 */
router.use(authenticate);
router.get('/', asyncHandler(listCrews));
router.get('/:id', asyncHandler(getCrew));
router.post('/', authorize('ADMIN'), asyncHandler(createCrew));
router.patch('/:id', authorize('ADMIN'), asyncHandler(updateCrew));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteCrew));
export default router;

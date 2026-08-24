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
router.use(authenticate);
router.get('/', asyncHandler(listCrews));
router.get('/:id', asyncHandler(getCrew));
router.post('/', authorize('ADMIN'), asyncHandler(createCrew));
router.patch('/:id', authorize('ADMIN'), asyncHandler(updateCrew));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteCrew));
export default router;

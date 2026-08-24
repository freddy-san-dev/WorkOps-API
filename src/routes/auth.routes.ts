import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/async-handler.js';
const router = Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a fictional platform user
 *     requestBody: { required: true }
 *     responses: { '201': { description: User and JWT created } }
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign in and receive a JWT
 *     responses: { '200': { description: Authenticated } }
 */
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
export default router;

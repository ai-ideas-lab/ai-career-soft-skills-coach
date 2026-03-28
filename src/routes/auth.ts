import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateAuth } from '../middleware/validateAuth';
import { register, login, getProfile, updateProfile, logout } from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', validateAuth, asyncHandler(getProfile));
router.put('/profile', validateAuth, asyncHandler(updateProfile));
router.post('/logout', validateAuth, asyncHandler(logout));

export { router as authRoutes };
import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { register, login, getProfile, updateProfile, logout } from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(getProfile));
router.put('/profile', asyncHandler(updateProfile));
router.post('/logout', asyncHandler(logout));

export { router as authRoutes };
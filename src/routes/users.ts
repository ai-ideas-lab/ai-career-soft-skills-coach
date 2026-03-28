import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateAuth } from '../middleware/validateAuth';

const router = Router();

// Placeholder for user routes
router.get('/profile', validateAuth, asyncHandler(async (req, res) => {
  res.json({ message: 'Get user profile - to be implemented' });
}));

router.put('/profile', validateAuth, asyncHandler(async (req, res) => {
  res.json({ message: 'Update user profile - to be implemented' });
}));

router.get('/progress', validateAuth, asyncHandler(async (req, res) => {
  res.json({ message: 'Get user progress - to be implemented' });
}));

export { router as userRoutes };
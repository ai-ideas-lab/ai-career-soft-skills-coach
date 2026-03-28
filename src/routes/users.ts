import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateAuth } from '../middleware/validateAuth';
import { getProfile, updateProfile } from '../controllers/authController';

const router = Router();

// User routes
router.get('/profile', validateAuth, asyncHandler(getProfile));
router.put('/profile', validateAuth, asyncHandler(updateProfile));

// TODO: Implement user progress endpoint
router.get('/progress', validateAuth, asyncHandler(async (req, res) => {
  res.json({ 
    message: 'Get user progress - to be implemented',
    progress: []
  });
}));

export { router as userRoutes };
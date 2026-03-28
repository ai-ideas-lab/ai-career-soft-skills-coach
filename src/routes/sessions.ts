import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateAuth } from '../middleware/validateAuth';
import { startSession, getSession, updateSessionProgress, completeSession, getUserSessions } from '../controllers/sessionController';

const router = Router();

// Start new session
router.post('/start', validateAuth, asyncHandler(startSession));

// Get session details
router.get('/:id', validateAuth, asyncHandler(getSession));

// Update session progress
router.put('/:id/progress', validateAuth, asyncHandler(updateSessionProgress));

// Complete session
router.post('/:id/complete', validateAuth, asyncHandler(completeSession));

// Get user sessions
router.get('/', validateAuth, asyncHandler(getUserSessions));

export { router as sessionRoutes };
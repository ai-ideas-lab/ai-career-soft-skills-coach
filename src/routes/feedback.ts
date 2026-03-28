import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateAuth } from '../middleware/validateAuth';
import { submitFeedback, getUserFeedback, getSessionFeedback, getFeedbackAnalytics } from '../controllers/feedbackController';

const router = Router();

// Feedback routes
router.post('/', validateAuth, asyncHandler(submitFeedback));
router.get('/user', validateAuth, asyncHandler(getUserFeedback));
router.get('/session/:sessionId', validateAuth, asyncHandler(getSessionFeedback));
router.get('/analytics', validateAuth, asyncHandler(getFeedbackAnalytics));

export { router as feedbackRoutes };
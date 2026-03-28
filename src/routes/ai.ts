import { Router } from 'express';
import { 
  generateDialogueResponse,
  evaluateQuestionResponse,
  getPersonalizedFeedback,
  generateScenarioTemplate,
  getAIRecommendations
} from '../controllers/aiController';
import { validateAuth } from '../middleware/validateAuth';

const router = Router();

// All AI routes require authentication
router.use(validateAuth);

// AI dialogue generation
router.post('/dialogue', generateDialogueResponse);

// AI question response evaluation
router.post('/evaluate-question', evaluateQuestionResponse);

// Personalized coaching feedback
router.get('/feedback/:scenarioId', getPersonalizedFeedback);

// Generate scenario templates
router.post('/generate-scenario', generateScenarioTemplate);

// AI recommendations based on user progress
router.get('/recommendations', getAIRecommendations);

export default router;
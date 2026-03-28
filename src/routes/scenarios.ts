import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateAuth } from '../middleware/validateAuth';
import { getScenarios, getScenario, createScenario, updateScenario, deleteScenario } from '../controllers/scenarioController';

const router = Router();

// Get all scenarios
router.get('/', asyncHandler(getScenarios));

// Get specific scenario
router.get('/:id', asyncHandler(getScenario));

// Create new scenario (admin only)
router.post('/', validateAuth, asyncHandler(createScenario));

// Update scenario (admin only)
router.put('/:id', validateAuth, asyncHandler(updateScenario));

// Delete scenario (admin only)
router.delete('/:id', validateAuth, asyncHandler(deleteScenario));

export { router as scenarioRoutes };
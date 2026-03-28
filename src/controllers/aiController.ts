import { Response } from 'express';
import { AuthRequest } from '../middleware/validateAuth';
import { AIService, AIServiceInput } from '../services/aiService';
import { createError } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const aiService = new AIService();
const prisma = new PrismaClient();

export const generateDialogueResponse = async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioId, userInput, dialogueContext } = req.body;

    if (!scenarioId || !userInput) {
      throw createError('Scenario ID and user input are required', 400);
    }

    const input: AIServiceInput = {
      scenarioId,
      userId: req.user!.id,
      userInput,
      dialogueContext: dialogueContext || []
    };

    const result = await aiService.generateDialogueResponse(input);

    res.json({
      response: result.response,
      score: result.score,
      feedback: result.feedback,
      suggestions: result.suggestions,
      message: 'AI response generated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  }
};

export const evaluateQuestionResponse = async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioId, questionId, userInput, dialogueContext } = req.body;

    if (!scenarioId || !questionId || !userInput) {
      throw createError('Scenario ID, question ID, and user input are required', 400);
    }

    const input: AIServiceInput = {
      scenarioId,
      userId: req.user!.id,
      userInput,
      dialogueContext: dialogueContext || []
    };

    const result = await aiService.evaluateQuestionResponse(input, questionId);

    res.json({
      response: result.response,
      score: result.score,
      feedback: result.feedback,
      suggestions: result.suggestions,
      message: 'Question response evaluated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to evaluate question response' });
    }
  }
};

export const getPersonalizedFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioId } = req.params;

    if (!scenarioId) {
      throw createError('Scenario ID is required', 400);
    }

    const feedback = await aiService.generatePersonalizedFeedback(req.user!.id, scenarioId);

    res.json({
      feedback,
      message: 'Personalized feedback generated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to generate personalized feedback' });
    }
  }
};

export const generateScenarioTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, topic } = req.body;

    if (!category || !difficulty || !topic) {
      throw createError('Category, difficulty, and topic are required', 400);
    }

    const scenario = await aiService.generateScenarioTemplate(category, difficulty, topic);

    res.json({
      scenario,
      message: 'Scenario template generated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to generate scenario template' });
    }
  }
};

export const getAIRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get user's progress and performance
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: { scenario: true }
    });

    const userSessions = await prisma.session.findMany({
      where: { userId },
      include: { scenario: true }
    });

    // Generate AI-based recommendations
    const recommendations = await aiService.generateRecommendations({
      progress,
      sessions: userSessions,
      userId
    });

    res.json({
      recommendations,
      message: 'AI recommendations generated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI recommendations' });
  }
};
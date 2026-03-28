import { Response } from 'express';
import { AuthRequest } from '../middleware/validateAuth';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getScenarios = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, limit = 20 } = req.query;
    
    const where: any = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = parseInt(difficulty as string);
    
    const scenarios = await prisma.scenario.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({ 
      scenarios,
      count: scenarios.length,
      message: 'Scenarios retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scenarios' });
  }
};

export const getScenario = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const scenario = await prisma.scenario.findUnique({
      where: { id },
      include: {
        dialogues: {
          orderBy: { timestamp: 'asc' },
        },
        questions: {
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!scenario) {
      throw createError('Scenario not found', 404);
    }

    res.json({ 
      scenario,
      message: 'Scenario retrieved successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Scenario not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to retrieve scenario' });
    }
  }
};

export const createScenario = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, difficulty, duration, dialogues, questions } = req.body;

    if (!title || !description || !category) {
      throw createError('Title, description, and category are required', 400);
    }

    const scenario = await prisma.scenario.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || 1,
        duration: duration || 10,
        dialogues: dialogues ? {
          create: dialogues,
        } : undefined,
        questions: questions ? {
          create: questions.map((q: any, index: number) => ({
            content: q.content,
            order: index + 1,
            options: q.options ? {
              create: q.options,
            } : undefined,
          })),
        } : undefined,
      },
      include: {
        dialogues: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    res.status(201).json({ 
      scenario,
      message: 'Scenario created successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create scenario' });
    }
  }
};

export const updateScenario = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, duration } = req.body;

    const existingScenario = await prisma.scenario.findUnique({
      where: { id }
    });

    if (!existingScenario) {
      throw createError('Scenario not found', 404);
    }

    const scenario = await prisma.scenario.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(difficulty !== undefined && { difficulty }),
        ...(duration !== undefined && { duration }),
      },
      include: {
        dialogues: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    res.json({ 
      scenario,
      message: 'Scenario updated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Scenario not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update scenario' });
    }
  }
};

export const deleteScenario = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingScenario = await prisma.scenario.findUnique({
      where: { id }
    });

    if (!existingScenario) {
      throw createError('Scenario not found', 404);
    }

    await prisma.scenario.delete({
      where: { id }
    });

    res.json({ 
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Scenario not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete scenario' });
    }
  }
};
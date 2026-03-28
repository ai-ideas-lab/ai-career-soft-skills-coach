import { Response } from 'express';
import { AuthRequest } from '../middleware/validateAuth';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const startSession = async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioId } = req.body;

    if (!scenarioId) {
      throw createError('Scenario ID is required', 400);
    }

    // Check if scenario exists
    const scenario = await prisma.scenario.findUnique({
      where: { id: scenarioId }
    });

    if (!scenario) {
      throw createError('Scenario not found', 404);
    }

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId: req.user!.id,
        scenarioId,
        status: 'active',
        startTime: new Date(),
      },
      include: {
        scenario: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.status(201).json({ 
      session,
      message: 'Session started successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error && error.message.includes('Scenario not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to start session' });
    }
  }
};

export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        scenario: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        feedback: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!session) {
      throw createError('Session not found', 404);
    }

    res.json({ 
      session,
      message: 'Session retrieved successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Session not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to retrieve session' });
    }
  }
};

export const updateSessionProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { progress, score } = req.body;

    if (progress === undefined) {
      throw createError('Progress value is required', 400);
    }

    const session = await prisma.session.update({
      where: { id },
      data: {
        progress: parseFloat(progress),
        ...(score !== undefined && { score }),
        updatedAt: new Date(),
      },
      include: {
        scenario: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.json({ 
      session,
      message: 'Session progress updated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Progress value is required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update session progress' });
    }
  }
};

export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { score, finalProgress } = req.body;

    const session = await prisma.session.update({
      where: { id },
      data: {
        status: 'completed',
        endTime: new Date(),
        ...(score !== undefined && { score }),
        ...(finalProgress !== undefined && { progress: parseFloat(finalProgress) }),
      },
      include: {
        scenario: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.json({ 
      session,
      message: 'Session completed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete session' });
  }
};

export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10, status } = req.query;

    const where: any = {
      userId: req.user!.id,
    };
    if (status) where.status = status;

    const sessions = await prisma.session.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      include: {
        scenario: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
          }
        }
      }
    });

    res.json({ 
      sessions,
      count: sessions.length,
      message: 'User sessions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user sessions' });
  }
};
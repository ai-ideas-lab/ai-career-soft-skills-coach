import { Response } from 'express';
import { AuthRequest } from '../middleware/validateAuth';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, content, rating, category } = req.body;

    if (!sessionId || !content || !rating) {
      throw createError('Session ID, content, and rating are required', 400);
    }

    // Check if session exists and belongs to user
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user!.id
      }
    });

    if (!session) {
      throw createError('Session not found or access denied', 404);
    }

    if (rating < 1 || rating > 5) {
      throw createError('Rating must be between 1 and 5', 400);
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user!.id,
        sessionId,
        content,
        rating,
        category,
      },
      include: {
        session: {
          select: {
            id: true,
            scenario: {
              select: {
                id: true,
                title: true,
                category: true,
              }
            }
          }
        },
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
      feedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error && error.message.includes('Session not found')) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof Error && error.message.includes('Rating must be')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to submit feedback' });
    }
  }
};

export const getUserFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const feedback = await prisma.feedback.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      include: {
        session: {
          select: {
            id: true,
            scenario: {
              select: {
                id: true,
                title: true,
                category: true,
              }
            }
          }
        }
      }
    });

    res.json({ 
      feedback,
      count: feedback.length,
      message: 'User feedback retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user feedback' });
  }
};

export const getSessionFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user!.id
      }
    });

    if (!session) {
      throw createError('Session not found or access denied', 404);
    }

    const feedback = await prisma.feedback.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    res.json({ 
      feedback,
      count: feedback.length,
      message: 'Session feedback retrieved successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Session not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to retrieve session feedback' });
    }
  }
};

export const getFeedbackAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [feedback, avgRating, totalRatings, categoryBreakdown] = await Promise.all([
      prisma.feedback.findMany({
        where: { ...where, userId: req.user!.id },
        include: {
          session: {
            select: {
              id: true,
              scenario: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                }
              }
            }
          }
        }
      }),
      prisma.feedback.aggregate({
        where: { ...where, userId: req.user!.id },
        _avg: { rating: true }
      }),
      prisma.feedback.count({
        where: { ...where, userId: req.user!.id }
      }),
      prisma.feedback.groupBy({
        by: ['category'],
        where: { ...where, userId: req.user!.id, category: { not: null } },
        _count: { id: true },
        _avg: { rating: true }
      })
    ]);

    const analytics = {
      totalFeedback: feedback.length,
      averageRating: avgRating._avg.rating || 0,
      totalRatings,
      categoryBreakdown,
      recentFeedback: feedback.slice(0, 5),
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      }
    };

    res.json({ 
      analytics,
      message: 'Feedback analytics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve feedback analytics' });
  }
};
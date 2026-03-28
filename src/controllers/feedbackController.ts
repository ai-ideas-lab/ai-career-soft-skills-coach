import { Response } from 'express';
import { AuthRequest } from '../middleware/validateAuth';

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, content, rating, category } = req.body;
    const userId = req.user!.id;

    if (!sessionId || !content || !rating) {
      return res.status(400).json({ error: 'Session ID, content, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // TODO: Save feedback to database
    const feedback = {
      id: Date.now().toString(),
      userId,
      sessionId,
      content,
      rating,
      category,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({ 
      feedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

export const getUserFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // TODO: Fetch user feedback from database
    const feedback = [
      {
        id: '1',
        userId,
        sessionId: '1',
        content: 'Great scenario! Really helped me understand conflict resolution.',
        rating: 5,
        category: 'overall',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        userId,
        sessionId: '2',
        content: 'The AI responses were a bit too slow.',
        rating: 3,
        category: 'response-time',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    res.json({ 
      feedback,
      total: feedback.length,
      message: 'User feedback retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user feedback' });
  }
};

export const getSessionFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.id;

    // TODO: Fetch session feedback from database
    const feedback = [
      {
        id: '1',
        userId,
        sessionId,
        content: 'Very helpful for practicing difficult conversations.',
        rating: 4,
        category: 'dialogue',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    res.json({ 
      feedback,
      total: feedback.length,
      message: 'Session feedback retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve session feedback' });
  }
};

export const getFeedbackAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // TODO: Calculate analytics from feedback data
    const analytics = {
      totalSessions: 10,
      averageRating: 4.2,
      ratingDistribution: {
        5: 6,
        4: 3,
        3: 1,
        2: 0,
        1: 0,
      },
      categoryBreakdown: {
        'dialogue': 8,
        'response-time': 1,
        'overall': 1,
      },
      recentFeedback: [
        {
          id: '1',
          sessionId: '10',
          content: 'Excellent scenario design',
          rating: 5,
          category: 'overall',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    };

    res.json({ 
      analytics,
      message: 'Feedback analytics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve feedback analytics' });
  }
};
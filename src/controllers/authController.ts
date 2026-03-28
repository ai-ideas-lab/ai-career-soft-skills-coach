import { Response } from 'express';
import { AuthRequest } from '../middleware/validateAuth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw createError('Email, password, and name are required', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret' as any,
      { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : '7d' }
    );

    res.status(201).json({ 
      user,
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret' as any,
      { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : '7d' }
    );

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.json({ 
      user: userResponse,
      token,
      message: 'User logged in successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error && error.message.includes('Invalid email or password')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to login user' });
    }
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch user profile from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({ 
      user,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('User not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, avatar } = req.body;

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        updatedAt: true,
      }
    });

    res.json({ 
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implement token invalidation if using refresh tokens
    res.json({ 
      message: 'User logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout user' });
  }
};
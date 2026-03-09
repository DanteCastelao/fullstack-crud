import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';
import { env } from '../utils/env';
import { AuthenticatedRequest } from '../types';

const router = Router();

// ─── Validation Schemas ─────────────────────────────────────────────────────────

const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required').trim().toLowerCase(),
        password: z.string().min(1, 'Password is required'),
    }),
});

// ─── Routes ─────────────────────────────────────────────────────────────────────

/** Get the authenticated user's role */
router.get('/role', authMiddleware, async (req, res, next) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;
        const user = await User.findById(id).select('role');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({ success: true, data: { role: user.role } });
    } catch (error) {
        next(error);
    }
});

/** Authenticate user and return JWT */
router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, entityId: user.entityId },
            env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3_600_000, // 1 hour
        });

        res.json({ success: true, data: { token }, message: 'Login successful' });
    } catch (error) {
        next(error);
    }
});

/** Clear authentication cookie */
router.post('/logout', (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.json({ success: true, message: 'Logout successful' });
});

/** Admin-only test route */
router.get(
    '/admin-only',
    authMiddleware,
    roleMiddleware('admin'),
    (_req, res) => {
        res.json({ success: true, message: 'Welcome, Admin!' });
    }
);

export default router;

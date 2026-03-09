import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { adminMiddleware } from '../middleware/admin';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';

const router = Router();

// ─── Validation Schemas ─────────────────────────────────────────────────────────

const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['admin', 'user']).default('user'),
    }),
});

// ─── Routes ─────────────────────────────────────────────────────────────────────

/** Create a new user (admin only) */
router.post('/', adminMiddleware, validate(createUserSchema), async (req, res, next) => {
    try {
        const { username, password, role } = req.body;

        const existing = await User.findOne({ username });
        if (existing) {
            throw new AppError('Username already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: user._id, username: user.username, role: user.role },
        });
    } catch (error) {
        next(error);
    }
});

/** List all users (admin only, excludes passwords) */
router.get('/', adminMiddleware, async (_req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
});

/** Get the current user's linked entity ID */
router.get('/entity', async (req, res, next) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;
        const user = await User.findById(id).select('entityId');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({ success: true, data: { entityId: user.entityId } });
    } catch (error) {
        next(error);
    }
});

export default router;

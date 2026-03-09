import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

/**
 * Admin-only route guard.
 * Must be used AFTER `authMiddleware`.
 */
export const adminMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
        return;
    }
    next();
};

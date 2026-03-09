import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

/**
 * Dynamic role-based route guard.
 * Must be used AFTER `authMiddleware`.
 *
 * @param requiredRole - The role required to access the route
 * @example router.get('/admin-only', authMiddleware, roleMiddleware('admin'), handler);
 */
export const roleMiddleware = (requiredRole: 'admin' | 'user') => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (req.user.role !== requiredRole) {
            res.status(403).json({
                success: false,
                message: `Forbidden. "${requiredRole}" role required.`,
            });
            return;
        }
        next();
    };
};

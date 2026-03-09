import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { env } from '../utils/env';

/**
 * JWT authentication middleware.
 * Supports both cookie-based and Bearer token authentication.
 * Attaches decoded user payload to `req.user`.
 */
export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    let token: string | undefined = req.cookies?.token;

    // Fallback: check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

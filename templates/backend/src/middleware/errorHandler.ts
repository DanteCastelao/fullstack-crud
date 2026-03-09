import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types';
import { env } from '../utils/env';

/**
 * Custom application error with HTTP status code.
 * Throw this in route handlers to send structured error responses.
 *
 * @example throw new AppError('User not found', 404);
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Centralized error handling middleware.
 * Catches all errors thrown in route handlers and returns consistent JSON responses.
 * Must be registered AFTER all routes.
 */
export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Internal server error';

    const response: ApiErrorResponse = {
        success: false,
        message,
    };

    // Include stack trace in development only
    if (env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    if (statusCode === 500) {
        console.error('💥 Unhandled error:', err);
    }

    res.status(statusCode).json(response);
};

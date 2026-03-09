import { Request } from 'express';
import { Types } from 'mongoose';

// ─── JWT Payload ────────────────────────────────────────────────────────────────

/** Decoded JWT payload attached to authenticated requests */
export interface JwtPayload {
    id: string;
    role: 'admin' | 'user';
    entityId?: string;
    iat?: number;
    exp?: number;
}

/** Express Request extended with authenticated user data */
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}

// ─── User ───────────────────────────────────────────────────────────────────────

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    password: string;
    role: 'admin' | 'user';
    entityId?: Types.ObjectId;
}

// ─── API Responses ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    stack?: string;
}

// ─── Environment ────────────────────────────────────────────────────────────────

export interface Env {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    EMAIL?: string;
    EMAIL_PASSWORD?: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

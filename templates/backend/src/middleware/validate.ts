import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Request validation middleware using Zod schemas.
 * Validates `req.body`, `req.query`, and/or `req.params` against provided schemas.
 *
 * @example
 * const loginSchema = z.object({ body: z.object({ username: z.string(), password: z.string() }) });
 * router.post('/login', validate(loginSchema), handler);
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
};

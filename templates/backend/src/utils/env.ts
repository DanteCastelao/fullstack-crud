import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variable schema — validates all required config at startup.
 * The application will fail fast with clear error messages if any are missing.
 */
const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGODB_URI: z.string().url({ message: 'MONGODB_URI must be a valid connection string' }),
    JWT_SECRET: z.string().min(8, { message: 'JWT_SECRET must be at least 8 characters' }),
    EMAIL: z.string().email().optional(),
    EMAIL_PASSWORD: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function validateEnv(): z.infer<typeof envSchema> {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        for (const issue of result.error.issues) {
            console.error(`   ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
    }

    return result.data;
}

/** Validated environment variables — safe to use throughout the application */
export const env = validateEnv();

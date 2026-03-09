import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './utils/env';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

const app = express();

// ─── Security ───────────────────────────────────────────────────────────────────

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── CORS ───────────────────────────────────────────────────────────────────────

const allowedOrigins: string[] = [
    'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// ─── Body Parsing ───────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Database ───────────────────────────────────────────────────────────────────

mongoose
    .connect(env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// ─── Routes ─────────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);

/** Health check endpoint */
app.get('/api/health', async (_req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        success: true,
        data: {
            status: 'ok',
            app: '{{APP_TITLE}}',
            environment: env.NODE_ENV,
            database: dbStatus,
            uptime: Math.floor(process.uptime()),
        },
    });
});

// ─── Error Handling ─────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────────────────

app.listen(env.PORT, () => {
    console.log(`🚀 {{APP_TITLE}} backend running on port ${env.PORT} [${env.NODE_ENV}]`);
});

export default app;

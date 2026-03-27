import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import { analyticsMiddleware } from './middleware/analytics.js';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.error('🔥 CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Middleware (index.js)

// CORS configuration - Allow Vercel and localhost dynamically
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://careerintel-phi.vercel.app',
    'https://careerintel.vercel.app',
    'http://localhost:3006',
    'http://localhost:3000',
    'http://127.0.0.1:3006',
    'http://127.0.0.1:3000'
].filter(Boolean);

console.log('🌐 Allowed Origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.warn(`🔒 CORS Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Track Analytics
app.use(analyticsMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', careerRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: process.env.NODE_ENV,
        timestamp: new Date()
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start Server Immediately
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

    // Connect to Database in background
    connectDB().catch(err => {
        console.error('⚠️ Post-startup DB connection failure:', err.message);
    });
});

// restart trigger

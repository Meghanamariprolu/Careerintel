import mongoose from 'mongoose';
import Analytics from '../models/Analytics.js';

export const analyticsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        // Only attempt to save analytics if MongoDB is connected (readyState 1)
        if (mongoose.connection.readyState !== 1) {
            return;
        }

        const responseTime = Date.now() - start;
        Analytics.create({
            endpoint: req.originalUrl,
            method: req.method,
            responseTime,
            statusCode: res.statusCode,
        }).catch((err) => console.error('Analytics tracking error:', err));
    });
    next();
};

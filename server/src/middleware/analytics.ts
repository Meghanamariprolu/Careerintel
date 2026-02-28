import { Request, Response, NextFunction } from 'express';
import Analytics from '../models/Analytics';

export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
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

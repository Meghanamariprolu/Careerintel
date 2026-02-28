import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (res: Response, userId: string, role: string) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

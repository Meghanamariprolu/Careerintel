import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (res: Response, userId: string, role: string) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });

    return token;
};


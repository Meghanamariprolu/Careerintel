import jwt from 'jsonwebtoken';

export const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token;
};


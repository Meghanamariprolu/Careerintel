import jwt from 'jsonwebtoken';

export const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always secure for Vercel <-> Render cross-domain
        sameSite: 'none', // Required for cross-domain cookies
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token;
};

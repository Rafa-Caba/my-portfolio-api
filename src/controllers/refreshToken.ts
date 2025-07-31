import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET;

export const refreshToken = (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    if (!JWT_REFRESH_SECRET || !JWT_ACCESS_SECRET) {
        throw new Error('❌ JWT secrets are missing in .env file');
    }

    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;

        // ✅ MATCH the login payload key
        const newAccessToken = jwt.sign(
            { id: decoded.id }, // this must match login payload!
            JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh error:', err);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

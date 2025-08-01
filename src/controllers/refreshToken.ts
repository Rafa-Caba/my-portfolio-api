import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET;

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.body.token;

    const decoded = jwt.decode(refreshToken) as JwtPayload | null;

    if (!decoded?.id) {
        res.status(403).json({ mensaje: 'Invalid token' });
        return;
    }

    const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        userId: decoded.id
    });

    if (!storedToken) {
        res.status(403).json({ mensaje: 'Refresh token not found or revoked' });
        return;
    }

    if (!JWT_REFRESH_SECRET || !JWT_ACCESS_SECRET) {
        throw new Error('❌ JWT secrets are missing in .env file');
    }

    try {
        const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username },
            JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ mensaje: 'Token expired or invalid' });
    }
};

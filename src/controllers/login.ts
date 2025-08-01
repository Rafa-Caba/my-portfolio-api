import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Wrong credentials' });
        }

        if (!JWT_REFRESH_SECRET || !JWT_SECRET) {
            throw new Error('❌ JWT secrets are missing in .env file');
        }

        // ✅ Create Access Token (shorter lifespan, for auth headers)
        const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

        // ✅ Create Refresh Token (longer, stored in cookie)
        const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        const isProd = process.env.NODE_ENV === 'production';

        // ✅ Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/api/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // ✅ Send access token + user
        res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl,
                bio: user.bio,
                role: user.role,
                personalTheme: user.personalTheme
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error upon login' });
    }
};

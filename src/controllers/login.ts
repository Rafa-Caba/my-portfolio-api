import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

import RefreshToken from '../models/RefreshToken';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { usernameOrEmail, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { correo: usernameOrEmail },
                { username: usernameOrEmail }
            ]
        }).populate('personalTheme');

        if (!user) {
            res.status(401).json({ mensaje: 'User not found' });
            return;
        }

        const passwordValida = await bcrypt.compare(password, user.password);
        if (!passwordValida) {
            res.status(401).json({ mensaje: 'Incorrect password' });
            return;
        }

        if (!JWT_REFRESH_SECRET || !JWT_SECRET) {
            throw new Error('❌ JWT secrets are missing in .env file');
        }

        const accessToken = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id, username: user.username },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await RefreshToken.create({ token: refreshToken, userId: user._id });

        await user.save();

        console.log({
            user,
            accessToken,
            refreshToken,
        });

        res.json({
            mensaje: 'Login successful',
            token: accessToken,
            refreshToken,
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
    } catch (error: any) {
        res.status(500).json({ mensaje: error.message });
    }
};
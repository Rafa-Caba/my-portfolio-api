// controllers/register.ts
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { CloudinaryFile } from '../types/cloudinary';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, bio } = req.body;

        if (!req.file?.path) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }

        const file = req.file as CloudinaryFile;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            bio,
            imageUrl: file.path,
            imagePublicId: file.filename || file.public_id,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('🔴 Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

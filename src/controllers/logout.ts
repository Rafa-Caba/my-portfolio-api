import { Request, Response } from 'express';

import RefreshToken from '../models/RefreshToken';

export const logout = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    try {
        await RefreshToken.deleteOne({ token });

        res.json({ mensaje: 'Logout successful' });
    } catch (error: any) {
        res.status(500).json({ mensaje: error.message });
    }
};
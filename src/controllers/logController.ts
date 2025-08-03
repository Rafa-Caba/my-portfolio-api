import { Request, Response } from 'express';
import Log from '../models/Log';
import User from '../models/User';

export const registerLog = async (req: Request, res: Response) => {
    try {
        const { action } = req.body;
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
        const userAgent = req.headers['user-agent'] || 'unknown';

        const cleanIP = ip.includes(',') ? ip.split(',')[0] : ip;

        const log = new Log({
            action,
            path: req.originalUrl,
            method: req.method,
            ip: cleanIP,
            userAgent,
        });

        await log.save();
        res.status(201).json({ message: 'Log recorded' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to record log', error });
    }
};

export const getAllLogs = async (req: Request, res: Response) => {
    try {
        const logs = await Log.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('user', 'name email image');

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logs', error });
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const recentLogs = await Log.find({})
            .sort({ createdAt: -1 })
            .limit(10);

        const activity = recentLogs.map(log => ({
            _id: log.id.toString(),
            action: log.action, // ✅ no extra formatting
            targetModel: log.targetModel,
            createdAt: log.createdAt ? log.createdAt.toISOString() : '',
        }));

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent activity', error });
    }
};

export const pingPresence = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (userId) {
            // update user "lastSeen" in DB or memory
            await User.findByIdAndUpdate(userId, {
                lastSeen: new Date(),
            });
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Ping error:', error);
        res.status(500).json({ ok: false });
    }
};
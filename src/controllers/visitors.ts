import { Request, Response, NextFunction } from 'express';
import Visitor from '../models/Visitor';

export const pingVisitor = async (req: Request, res: Response) => {
    try {
        const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'Unknown';

        await Visitor.findOneAndUpdate(
            { ip },
            {
                lastSeen: new Date(),
                userAgent: req.headers['user-agent'] || 'unknown',
                path: req.body.path,
            },
            { upsert: true, new: true }
        );

        res.json({ ok: true });
    } catch (err) {
        console.error('Ping error:', err);
        res.status(500).json({ ok: false });
    }
};

export const getActiveVisitors = async (req: Request, res: Response) => {
    const cutoff = new Date(Date.now() - 60 * 1000); // Active in last 60s

    const activeVisitors = await Visitor.find({
        lastSeen: { $gte: cutoff }
    });

    res.json({ count: activeVisitors.length });
};
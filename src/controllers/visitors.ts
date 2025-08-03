import { Request, Response } from 'express';
import axios from 'axios';
import Visitor from '../models/Visitor';

export const pingVisitor = async (req: Request, res: Response) => {
    try {
        const ip =
            req.headers['x-forwarded-for']?.toString().split(',')[0] ||
            req.socket.remoteAddress ||
            'Unknown';

        // Skip localhost/::1
        if (ip === '::1' || ip === '127.0.0.1') return res.sendStatus(200);

        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        const { city, region, country_name, latitude, longitude } = geo.data;

        await Visitor.findOneAndUpdate(
            { ip },
            {
                lastSeen: new Date(),
                userAgent: req.headers['user-agent'] || 'unknown',
                path: req.body.path,
                location: {
                    city,
                    region,
                    country: country_name,
                    latitude,
                    longitude,
                },
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

export const getVisitorLocations = async (req: Request, res: Response) => {
    const cutoff = new Date(Date.now() - 60 * 1000); // last 60s
    const visitors = await Visitor.find(
        { lastSeen: { $gte: cutoff }, 'location.latitude': { $exists: true } },
        { location: 1 }
    );

    res.json(visitors.map((v) => ({
        city: v.location.city,
        region: v.location.region,
        country: v.location.country,
        countryCode: v.location.countryCode,
        latitude: v.location.latitude,
        longitude: v.location.longitude,
        lastSeen: v.lastSeen,
    })));
};
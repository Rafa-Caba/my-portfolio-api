import { Request, Response } from 'express';
import axios from 'axios';
import Visit, { IVisit } from '../models/Visit';

export const registerVisit = async (req: Request, res: Response) => {
    try {
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
        const userAgent = req.headers['user-agent'] || 'unknown';
        const { path } = req.body;

        const cleanIP = ip.includes(',') ? ip.split(',')[0] : ip;

        let locationData = {
            country: '',
            city: '',
            region: '',
            org: ''
        };

        try {
            const { data } = await axios.get(`https://ipapi.co/${cleanIP}/json/`);
            locationData = {
                country: data.country_name || '',
                city: data.city || '',
                region: data.region || '',
                org: data.org || ''
            };
        } catch (geoErr: unknown) {
            if (axios.isAxiosError(geoErr)) {
                console.warn('📍 IP location lookup failed:', geoErr.message);
            } else {
                console.warn('📍 Unknown error during IP lookup:', geoErr);
            }
        }

        const visit = new Visit({
            ip: cleanIP,
            userAgent,
            path,
            ...locationData
        });

        await visit.save();
        res.status(201).json({ message: 'Visit recorded' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const getRecentVisits = async (req: Request, res: Response) => {
    try {
        const { from, to } = req.query;

        const filter: Record<string, any> = {};

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from as string);
            if (to) filter.createdAt.$lte = new Date(to as string);
        }

        const visits = await Visit.find(filter)
            .sort({ createdAt: -1 })
            .limit(50); // optionally increase

        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch visits', error });
    }
};

export const getVisitCount = async (req: Request, res: Response) => {
    try {
        const total = await Visit.countDocuments();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Failed to count visits', error });
    }
};

export const getVisitsGroupedByPath = async (req: Request, res: Response) => {
    try {
        const grouped = await Visit.aggregate([
            {
                $group: {
                    _id: '$path',
                    count: { $sum: 1 },
                    lastVisit: { $max: '$createdAt' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: 'Failed to group visits', error });
    }
};

export const getVisitsGroupedByDate = async (req: Request, res: Response) => {
    try {
        const grouped: IVisit[] = await Visit.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: 'Failed to group visits by date', error });
    }
};
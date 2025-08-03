import { Request, Response, NextFunction } from 'express';
import Log from '../models/Log';
import * as isbot from 'isbot';

export const logAction = (
    action: string,
    targetModel: 'Visit' | 'User' | 'Settings' | 'Project'
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userAgent = req.headers['user-agent'] || 'Unknown';

            if (isbot.isbot(userAgent)) {
                console.log('🤖 Bot detected, skipping log.');
                return next();
            }

            const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'Unknown';
            const userId = req.user?.id || req.body.userId;
            const method = req.method;
            const path = req.originalUrl;

            await Log.create({
                action,
                user: userId ?? undefined,
                ip,
                userAgent,
                method,
                path,
                targetModel,
            });

            next();
        } catch (error) {
            console.warn('⚠️ Failed to log action:', error);
            next();
        }
    };
};

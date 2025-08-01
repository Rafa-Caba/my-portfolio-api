import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface DecodedToken extends JwtPayload {
    id: string;
    username: string;
}

export interface AuthenticatedRequest extends Request {
    user?: DecodedToken;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is missing in env');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        // ✅ Cast req to AuthenticatedRequest before assigning
        (req as AuthenticatedRequest).user = decoded as DecodedToken;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;

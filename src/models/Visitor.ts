import { Schema, model, Document } from 'mongoose';

export interface IVisitor extends Document {
    ip: string;
    lastSeen: Date;
    userAgent?: string;
    path?: string;
    location: {
        city: string,
        region: string,
        country: string,
        countryCode: string;
        latitude: number,
        longitude: number,
        lastSeen: string;
    },
}

const VisitorSchema = new Schema<IVisitor>({
    ip: { type: String, required: true },
    lastSeen: { type: Date, default: Date.now },
    userAgent: String,
    path: String,
    location: {
        city: String,
        region: String,
        country: String,
        countryCode: String,
        latitude: Number,
        longitude: Number,
        lastSeen: String
    },
});

export default model<IVisitor>('Visitor', VisitorSchema);

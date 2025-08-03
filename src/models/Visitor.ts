import { Schema, model, Document } from 'mongoose';

export interface IVisitor extends Document {
    ip: string;
    lastSeen: Date;
    userAgent?: string;
    path?: string;
}

const VisitorSchema = new Schema<IVisitor>({
    ip: { type: String, required: true },
    lastSeen: { type: Date, default: Date.now },
    userAgent: String,
    path: String,
});

export default model<IVisitor>('Visitor', VisitorSchema);

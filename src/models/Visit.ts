import { Schema, model, Document } from 'mongoose';

export interface IVisit extends Document {
    ip: string;
    userAgent: string;
    path: string;
    country?: string;
    city?: string;
    region?: string;
    org?: string;
    createdAt?: Date;
}

const VisitSchema = new Schema<IVisit>(
    {
        ip: { type: String, required: true },
        userAgent: { type: String, required: true },
        path: { type: String, required: true },
        country: { type: String },
        city: { type: String },
        region: { type: String },
        org: { type: String }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Visit = model<IVisit>('Visit', VisitSchema);
export default Visit;

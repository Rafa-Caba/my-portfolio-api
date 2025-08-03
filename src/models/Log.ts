import { Schema, model, Document, Types } from 'mongoose';

export interface ILog extends Document {
    action: string;
    ip: string;
    method: string;
    path: string;
    user: Types.ObjectId,
    userAgent: string;
    targetModel: string;
    createdAt?: Date;
}

const LogSchema = new Schema<ILog>(
    {
        action: { type: String, required: true },
        ip: { type: String, required: true },
        method: { type: String, required: true },
        path: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        userAgent: { type: String, required: true },
        targetModel: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Log = model<ILog>('Log', LogSchema);
export default Log;

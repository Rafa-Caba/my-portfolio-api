import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    title?: string;
    role?: 'Admin' | 'Editor' | 'Viewer';
    imageUrl: string;
    imagePublicId?: string;
    personalTheme?: string;
    bio: string;
    active?: boolean;
    telephone?: string;
    visibility: {
        name?: boolean;
        username?: boolean;
        email?: boolean;
        title?: boolean;
        role?: boolean;
        imageUrl?: boolean;
        personalTheme?: boolean;
        bio?: boolean;
        telephone?: boolean;
        quickFacts?: boolean;
    },
    quickFacts?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true, lowercase: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        title: { type: String, required: false },
        role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], default: 'Admin' },
        imageUrl: { type: String, required: false },
        imagePublicId: { type: String, required: false },
        personalTheme: { type: String },
        bio: { type: String, required: true },
        telephone: { type: String, required: false },
        visibility: {
            name: { type: Boolean, default: false },
            username: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            title: { type: Boolean, default: false },
            role: { type: Boolean, default: false },
            imageUrl: { type: Boolean, default: false },
            personalTheme: { type: Boolean, default: false },
            bio: { type: Boolean, default: false },
            telephone: { type: Boolean, default: false },
            quickFacts: { type: Boolean, default: false },
        },
        quickFacts: {
            type: [String],
            default: [],
        },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const User = model<IUser>('User', UserSchema);
export default User;

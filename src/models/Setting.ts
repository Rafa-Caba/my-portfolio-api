import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
    homepageTagline: string;
    aboutText: string;
    contactEmail: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        facebook?: string;
    };
    logoUrl?: string;
    faviconUrl?: string;
    isPublic?: boolean;
    visibility?: {
        homepageTagline?: boolean;
        aboutText?: boolean;
        contactEmail?: boolean;
        socialLinks?: boolean;
        logoUrl?: boolean;
        faviconUrl?: boolean;
    };
}

const SettingSchema = new Schema<ISetting>({
    homepageTagline: { type: String, required: true },
    aboutText: { type: String, required: true },
    contactEmail: { type: String, required: true },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        facebook: { type: String },
    },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    visibility: {
        homepageTagline: { type: Boolean, default: false },
        aboutText: { type: Boolean, default: false },
        contactEmail: { type: Boolean, default: false },
        socialLinks: { type: Boolean, default: false },
        logoUrl: { type: Boolean, default: false },
        faviconUrl: { type: Boolean, default: false },
    },
});

const Setting = model<ISetting>('Setting', SettingSchema);
export default Setting;

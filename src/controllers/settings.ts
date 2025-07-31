import { Request, Response } from 'express';
import Setting, { type ISetting } from '../models/Setting';
import { CloudinaryFile } from '../types/cloudinary';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary';

export const getSettings = async (req: Request, res: Response) => {
    try {
        const setting = await Setting.findOne();

        res.status(200).json(setting);
    } catch (err) {
        console.error('Error getting settings:', err);
        res.status(500).json({ error: 'Failed to get settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    const data: Partial<ISetting> = req.body;

    // Access uploaded files
    const files = req.files as {
        logo?: CloudinaryFile[];
        favicon?: CloudinaryFile[];
    };

    try {
        const existing = await Setting.findOne();

        // Optional: cleanup old images
        if (existing?.logoUrl && files?.logo?.[0]) {
            await deleteFromCloudinary(existing.logoUrl);
        }

        if (existing?.faviconUrl && files?.favicon?.[0]) {
            await deleteFromCloudinary(existing.faviconUrl);
        }

        // Set new image URLs if available
        if (files?.logo?.[0]) {
            data.logoUrl = files.logo[0].path;
        }

        if (files?.favicon?.[0]) {
            data.faviconUrl = files.favicon[0].path;
        }

        if (typeof data.visibility === 'string') {
            try {
                data.visibility = JSON.parse(data.visibility);
            } catch (err) {
                console.warn('Invalid visibility JSON');
            }
        }

        let updated;
        if (existing) {
            updated = await Setting.findByIdAndUpdate(existing._id, data, {
                new: true,
            });
        } else {
            updated = await Setting.create(data);
        }

        res.status(200).json(updated);
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

export const getPublicSettings = async (req: Request, res: Response) => {
    const setting = await Setting.findOne();

    if (!setting) return res.status(404).json({ error: 'Settings not found' });

    const { visibility } = setting;
    const publicSettings: Partial<ISetting> = {};

    if (visibility?.homepageTagline) publicSettings.homepageTagline = setting.homepageTagline;
    if (visibility?.aboutText) publicSettings.aboutText = setting.aboutText;
    if (visibility?.contactEmail) publicSettings.contactEmail = setting.contactEmail;
    if (visibility?.socialLinks) publicSettings.socialLinks = setting.socialLinks;
    if (visibility?.logoUrl) publicSettings.logoUrl = setting.logoUrl;
    if (visibility?.faviconUrl) publicSettings.faviconUrl = setting.faviconUrl;

    res.json(publicSettings);
};
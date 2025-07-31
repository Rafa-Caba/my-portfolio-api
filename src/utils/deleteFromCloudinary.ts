import { v2 as cloudinary } from 'cloudinary';

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('❌ Failed to delete image from Cloudinary', error);
    }
};
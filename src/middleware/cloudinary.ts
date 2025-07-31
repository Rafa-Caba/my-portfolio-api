// middlewares/cloudinary.ts
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Profile picture
export const uploadUserImage = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'portfolio-project/users',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: (req: Express.Request, file: Express.Multer.File): string => {
                const name = file.originalname.split('.')[0];
                return `usuario_${name}_${Date.now()}`;
            },
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
        } as any,
    }),
});

// Project Images
export const uploadProjectImage = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'portfolio-project/projects',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: (req: Express.Request, file: Express.Multer.File): string => {
                const name = file.originalname.split('.')[0];
                return `project_${name}_${Date.now()}`;
            },
            transformation: [{ width: 1200, crop: 'limit' }],
        } as any,
    }),
});

// For logo + favicon
export const uploadSiteSettings = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'portfolio-project/site-settings',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'ico'],
            transformation: [{ width: 512, height: 512, crop: 'limit' }],
        } as any,
    }),
});
import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings';
import verifyToken from '../middleware/auth';
import { uploadSiteSettings } from '../middleware/cloudinary';

const router = Router();

router.get('/public-settings', getSettings);
router.get('/', getSettings);
router.patch('/', verifyToken, uploadSiteSettings.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
]), updateSettings);

export default router;

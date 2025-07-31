import { Router } from 'express';
import { register } from '../controllers/register';
import { uploadUserImage } from '../middleware/cloudinary';

const router = Router();

router.post('/', uploadUserImage.single('imagen'), register);

export default router;

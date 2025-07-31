import { Router } from 'express';
import verifyToken from '../middleware/auth';
import { changePassword, getProfile, getPublicUserProfile, getUserById, updateUserById } from '../controllers/users';
import { uploadUserImage } from '../middleware/cloudinary';


const router = Router();

router.get('/profile', verifyToken, getProfile);
router.get('/public-user-profile', getPublicUserProfile);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, uploadUserImage.single('image'), updateUserById);
router.patch('/change-password', verifyToken, changePassword);

export default router;

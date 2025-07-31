import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard';
import verifyToken from '../middleware/auth';

const router = Router();

router.get('/stats', verifyToken, getDashboardStats); // protect if needed

export default router;

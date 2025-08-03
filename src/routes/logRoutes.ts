import { Router } from 'express';
import { getRecentActivity, getAllLogs, registerLog, pingPresence } from '../controllers/logController';
import { logAction } from '../middleware/logAction';
import verifyToken from '../middleware/auth';

const router = Router();

router.post('/', registerLog);
router.post('/ping', pingPresence);
router.get('/', verifyToken, getAllLogs);
router.get('/recent', verifyToken, getRecentActivity);

export default router;
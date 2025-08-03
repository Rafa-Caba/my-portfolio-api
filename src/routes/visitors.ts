import { Router } from 'express';
import { getActiveVisitors, pingVisitor } from "../controllers/visitors";
import verifyToken from '../middleware/auth';

const router = Router();

router.post('/ping-visitor', pingVisitor);
router.get('/active', verifyToken, getActiveVisitors);

export default router;
import { Router } from 'express';
import { getActiveVisitors, getVisitorLocations, pingVisitor } from "../controllers/visitors";
import verifyToken from '../middleware/auth';

const router = Router();

router.post('/ping-visitor', pingVisitor);
router.get('/active', verifyToken, getActiveVisitors);
router.get('/map', verifyToken, getVisitorLocations);

export default router;
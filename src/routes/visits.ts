import { Router } from 'express';
import {
    registerVisit,
    getRecentVisits,
    getVisitCount,
    getVisitsGroupedByPath,
    getVisitsGroupedByDate
} from '../controllers/visits';
import { logAction } from '../middleware/logAction';

const router = Router();

router.post('/', logAction('Tracked Visit', 'Visit'), registerVisit);
router.get('/', getRecentVisits);
router.get('/count', getVisitCount);
router.get('/group-by-path', getVisitsGroupedByPath);
router.get('/group-by-date', getVisitsGroupedByDate);

export default router;

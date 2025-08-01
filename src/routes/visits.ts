import { Router } from 'express';
import {
    registerVisit,
    getRecentVisits,
    getVisitCount,
    getVisitsGroupedByPath,
    getVisitsGroupedByDate
} from '../controllers/visits';

const router = Router();

router.post('/', registerVisit);
router.get('/', getRecentVisits);
router.get('/count', getVisitCount);
router.get('/group-by-path', getVisitsGroupedByPath);
router.get('/group-by-date', getVisitsGroupedByDate);

export default router;

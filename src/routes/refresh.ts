import { Router } from 'express';
import { refreshToken } from '../controllers/refreshToken';

const router = Router();

router.post('/', refreshToken);

export default router;
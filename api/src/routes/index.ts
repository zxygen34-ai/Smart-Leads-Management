import { Router } from 'express';

import { health } from '../controllers/healthController';
import authRoutes from './authRoutes';
import leadRoutes from './leadRoutes';

const router = Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;

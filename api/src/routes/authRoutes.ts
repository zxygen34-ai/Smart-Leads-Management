import { Router } from 'express';

import { login, register, seedAdmin } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema, seedAdminSchema } from '../validators/authValidators';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/seed-admin', validateRequest(seedAdminSchema), seedAdmin);

export default router;

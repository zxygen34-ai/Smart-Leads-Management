import { Request, Response } from 'express';

import { env } from '../config/env';
import { ApiError } from '../middleware/errorHandler';
import { loginUser, registerUser, seedAdminUser } from '../services/authService';
import { ok } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(ok(result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);
  res.status(200).json(ok(result));
});

export const seedAdmin = asyncHandler(async (req: Request, res: Response) => {
  if (!env.adminSeedKey) {
    throw new ApiError('Admin seed key not configured', 400, 'ADMIN_SEED_DISABLED');
  }

  const providedKey = req.header('x-admin-seed-key');

  if (providedKey !== env.adminSeedKey) {
    throw new ApiError('Forbidden', 403, 'FORBIDDEN');
  }

  const result = await seedAdminUser(req.body);
  res.status(201).json(ok(result));
});

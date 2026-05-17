import { NextFunction, Request, Response } from 'express';

import { UserRole, User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyToken } from '../utils/jwt';
import { ApiError } from './errorHandler';

export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const token = header.replace('Bearer ', '').trim();

    let payload: { sub: string; role: UserRole };

    try {
      payload = verifyToken(token);
    } catch (_err) {
      throw new ApiError('Invalid token', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(payload.sub).select('name email role');

    if (!user) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  }
);

export function requireRole(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Unauthorized', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Forbidden', 403, 'FORBIDDEN'));
    }

    return next();
  };
}

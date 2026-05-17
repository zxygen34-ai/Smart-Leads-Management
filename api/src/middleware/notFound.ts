import { NextFunction, Request, Response } from 'express';

import { ApiError } from './errorHandler';

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError('Route not found', 404, 'NOT_FOUND'));
}

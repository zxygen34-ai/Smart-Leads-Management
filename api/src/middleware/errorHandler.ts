import { NextFunction, Request, Response } from 'express';

import { fail } from '../utils/apiResponse';

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const code = err instanceof ApiError ? err.code : 'INTERNAL_ERROR';
  const details = err instanceof ApiError ? err.details : undefined;

  res.status(status).json(fail(err.message || 'Internal Server Error', code, details));
}

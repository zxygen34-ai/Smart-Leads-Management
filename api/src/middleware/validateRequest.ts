import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

import { ApiError } from './errorHandler';

type ParsedPayload = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      }) as ParsedPayload;

      if (parsed.body !== undefined) {
        req.body = parsed.body as Request['body'];
      }

      if (parsed.query !== undefined) {
        req.query = parsed.query as Request['query'];
      }

      if (parsed.params !== undefined) {
        req.params = parsed.params as Request['params'];
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          new ApiError('Validation failed', 400, 'VALIDATION_ERROR', err.issues)
        );
      }

      return next(err as Error);
    }
  };
}

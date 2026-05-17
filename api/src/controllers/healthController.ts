import { Request, Response } from 'express';

import { ok } from '../utils/apiResponse';

export function health(_req: Request, res: Response): void {
  res.status(200).json(ok({ status: 'ok' }));
}

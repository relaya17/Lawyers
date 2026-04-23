import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const f = err.flatten();
    const first = Object.values(f.fieldErrors).flat()[0];
    res.status(400).json({
      error: typeof first === 'string' ? first : 'נתונים לא תקינים',
      details: f.fieldErrors,
    });
    return;
  }

  const status =
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    typeof (err as AppError).statusCode === 'number'
      ? (err as AppError).statusCode!
      : 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    console.error('[Server Error]', err);
  }

  res.status(status).json({ error: message });
}

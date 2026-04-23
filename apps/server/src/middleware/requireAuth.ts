import type { Request, Response, NextFunction } from 'express';
import type { User } from '@myorg/shared/store/slices/authSlice';
import { getUserFromBearer } from '../auth/authService.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.authUser = await getUserFromBearer(req.headers.authorization);
    next();
  } catch (e) {
    const err = e as { statusCode?: number; message?: string };
    res.status(err.statusCode ?? 401).json({ error: err.message ?? 'לא מאומת' });
  }
}

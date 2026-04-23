import { Router } from 'express';
import { aiRouter } from './ai.js';
import { virtualCourt2SyncRouter } from './virtualCourt2Sync.js';
import { virtualCourt2ImportRouter } from './virtualCourt2Import.js';
import { authRouter } from './auth.js';

export const router = Router();

// Example: GET /api/health
router.get('/health', (_req, res) => {
  res.json({ api: 'ok' });
});

// Auth — JWT access + refresh HttpOnly, Zod, CSRF על refresh/logout
router.use('/auth', authRouter);

// AI proxy — keeps AI_API_KEY server-side only
router.use('/ai', aiRouter);

// Virtual Court 2 — שמירת צילום תיק לסנכרון (MongoDB)
router.use('/virtual-court-2', virtualCourt2SyncRouter);
router.use('/virtual-court-2', virtualCourt2ImportRouter);

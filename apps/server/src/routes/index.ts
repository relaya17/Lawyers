import { Router } from 'express';
import { aiRouter } from './ai.js';

export const router = Router();

// Example: GET /api/health
router.get('/health', (_req, res) => {
  res.json({ api: 'ok' });
});

// AI proxy — keeps AI_API_KEY server-side only
router.use('/ai', aiRouter);

// TODO: Add route modules here
// router.use('/auth', authRouter);
// router.use('/cases', casesRouter);
// router.use('/contracts', contractsRouter);

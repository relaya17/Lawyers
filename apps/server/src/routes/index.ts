import { Router } from 'express';

export const router = Router();

// Example: GET /api/health
router.get('/health', (_req, res) => {
  res.json({ api: 'ok' });
});

// TODO: Add route modules here
// router.use('/auth', authRouter);
// router.use('/cases', casesRouter);
// router.use('/contracts', contractsRouter);

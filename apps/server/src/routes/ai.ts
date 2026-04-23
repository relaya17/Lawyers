import { Router, type Request, type Response, type NextFunction } from 'express';
import { virtualCourtAiSubRouter } from './virtualCourtAiSub.js';

export const aiRouter = Router();

aiRouter.use('/virtual-court', virtualCourtAiSubRouter);

const AI_API_URL = process.env.AI_API_URL || 'https://api.contractlab.ai';
const AI_API_KEY = process.env.AI_API_KEY;

/**
 * POST /api/ai/analyze
 * Proxy for AI contract analysis — keeps AI_API_KEY server-side only.
 */
aiRouter.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!AI_API_KEY) {
      res.status(503).json({ error: 'AI service not configured' });
      return;
    }

    const response = await fetch(`${AI_API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'AI service error' });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/alternatives
 * Proxy for alternative clause suggestions.
 */
aiRouter.post('/alternatives', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!AI_API_KEY) {
      res.status(503).json({ error: 'AI service not configured' });
      return;
    }

    const response = await fetch(`${AI_API_URL}/alternatives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'AI service error' });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

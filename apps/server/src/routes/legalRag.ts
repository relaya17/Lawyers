import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAiMarginalBudget } from '../middleware/requireAiMarginalBudget.js';
import { answerWithRag, searchLegalKnowledge } from '../legal/legalRagService.js';
import { isEmbeddingsConfigured } from '../services/openaiEmbeddings.js';
import { isLegalKbTableReady } from '../legal/ragRepo.js';

export const legalRagRouter = Router();

const QueryBodySchema = z.object({
  query: z.string().min(3).max(8000),
  matchThreshold: z.number().min(0).max(1).optional(),
  matchCount: z.number().int().min(1).max(10).optional(),
  verifiedOnly: z.boolean().optional(),
});

/** שאילתת RAG מלאה (שליפה + ניסוח) — למשתמש מחובר */
legalRagRouter.post(
  '/rag/query',
  requireAuth,
  requireAiMarginalBudget(),
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await isLegalKbTableReady())) {
      res.status(503).json({
        error: 'מאגר הידע לא מוכן',
        hint: 'הריצי את sql/legal/001_legal_knowledge_base.sql מול PostgreSQL',
      });
      return;
    }
    if (!isEmbeddingsConfigured()) {
      res.status(503).json({ error: 'Embeddings לא מוגדרים', hint: 'OPENAI_API_KEY' });
      return;
    }

    const body = QueryBodySchema.parse(req.body);
    const result = await answerWithRag({
      query: body.query,
      matchThreshold: body.matchThreshold ?? 0.45,
      matchCount: body.matchCount ?? 4,
      verifiedOnly: body.verifiedOnly ?? false,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/** שליפה בלבד (בלי LLM) — לאימות מהיר */
legalRagRouter.post(
  '/rag/search',
  requireAuth,
  requireAiMarginalBudget(),
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await isLegalKbTableReady())) {
      res.status(503).json({
        error: 'מאגר הידע לא מוכן',
        hint: 'הריצי את sql/legal/001_legal_knowledge_base.sql',
      });
      return;
    }
    if (!isEmbeddingsConfigured()) {
      res.status(503).json({ error: 'Embeddings לא מוגדרים' });
      return;
    }

    const body = QueryBodySchema.parse(req.body);
    const result = await searchLegalKnowledge({
      query: body.query,
      matchThreshold: body.matchThreshold ?? 0.35,
      matchCount: body.matchCount ?? 5,
      verifiedOnly: body.verifiedOnly ?? false,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

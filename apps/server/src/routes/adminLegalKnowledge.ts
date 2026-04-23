import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  getLegalKnowledgeStats,
  listLegalKnowledgeDocuments,
  updateVerificationStatus,
  insertLegalDocument,
  isLegalKbTableReady,
} from '../legal/ragRepo.js';
import { searchLegalKnowledge } from '../legal/legalRagService.js';
import { createEmbedding, isEmbeddingsConfigured } from '../services/openaiEmbeddings.js';

export const adminLegalKnowledgeRouter = Router();

adminLegalKnowledgeRouter.use(requireAuth, requireAdmin);

adminLegalKnowledgeRouter.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await isLegalKbTableReady())) {
      res.status(503).json({ error: 'מאגר לא קיים', ready: false });
      return;
    }
    const stats = await getLegalKnowledgeStats();
    res.json({ ready: true, ...stats });
  } catch (err) {
    next(err);
  }
});

const SearchPlaygroundSchema = z.object({
  query: z.string().min(2).max(8000),
  matchThreshold: z.number().min(0).max(1).optional(),
  matchCount: z.number().int().min(1).max(15).optional(),
  verifiedOnly: z.boolean().optional(),
});

adminLegalKnowledgeRouter.post(
  '/vector-search',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!(await isLegalKbTableReady())) {
        res.status(503).json({ error: 'מאגר לא מוכן' });
        return;
      }
      if (!isEmbeddingsConfigured()) {
        res.status(503).json({ error: 'OPENAI_API_KEY נדרש לחיפוש ווקטורי' });
        return;
      }
      const body = SearchPlaygroundSchema.parse(req.body);
      const result = await searchLegalKnowledge({
        query: body.query,
        matchThreshold: body.matchThreshold ?? 0.35,
        matchCount: body.matchCount ?? 8,
        verifiedOnly: body.verifiedOnly ?? false,
      });
      res.json(result.citations);
    } catch (err) {
      next(err);
    }
  },
);

adminLegalKnowledgeRouter.get('/documents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await isLegalKbTableReady())) {
      res.status(503).json({ error: 'מאגר לא מוכן' });
      return;
    }
    const q = req.query;
    const limit = Math.min(parseInt(String(q.limit || '20'), 10) || 20, 100);
    const offset = parseInt(String(q.offset || '0'), 10) || 0;
    const search = typeof q.search === 'string' ? q.search : undefined;
    const status =
      q.status === 'draft' || q.status === 'verified' || q.status === 'all' ? q.status : 'all';

    const { rows, total } = await listLegalKnowledgeDocuments({
      search,
      verificationStatus: status,
      limit,
      offset,
    });
    res.json({ rows, total, limit, offset });
  } catch (err) {
    next(err);
  }
});

const PatchVerifySchema = z.object({
  verificationStatus: z.enum(['draft', 'verified']),
});

adminLegalKnowledgeRouter.patch(
  '/documents/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = PatchVerifySchema.parse(req.body);
      const ok = await updateVerificationStatus(id, body.verificationStatus);
      if (!ok) {
        res.status(404).json({ error: 'רשומה לא נמצאה' });
        return;
      }
      res.json({ ok: true, id });
    } catch (err) {
      next(err);
    }
  },
);

const CreateDocSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.string().min(10).max(50000),
  sourceUrl: z.string().max(2000).optional().nullable(),
  category: z.string().max(120).optional().nullable(),
  verificationStatus: z.enum(['draft', 'verified']).optional(),
  computeEmbedding: z.boolean().optional(),
});

adminLegalKnowledgeRouter.post('/documents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await isLegalKbTableReady())) {
      res.status(503).json({ error: 'מאגר לא מוכן' });
      return;
    }
    const body = CreateDocSchema.parse(req.body);
    let embedding: number[] | null = null;
    if (body.computeEmbedding !== false) {
      if (!isEmbeddingsConfigured()) {
        res.status(503).json({ error: 'אין מפתח OpenAI לחישוב embedding' });
        return;
      }
      embedding = await createEmbedding(body.content);
    }
    const id = await insertLegalDocument({
      title: body.title ?? null,
      content: body.content,
      sourceUrl: body.sourceUrl ?? null,
      category: body.category ?? null,
      verificationStatus: body.verificationStatus ?? 'draft',
      embedding,
    });
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

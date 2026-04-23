import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { isLlmConfigured } from '../services/virtualCourtOpenAI.js';
import {
  importFromCategoryWithOptionalSearch,
  importFromPastedText,
  importFromUrl,
} from '../services/realCaseImport.js';

export const virtualCourt2ImportRouter = Router();

const CategoryFields = z.object({
  category: z.string().min(1),
  courtLevel: z.string().optional(),
  caseTrack: z.string().optional(),
});

const TextBodySchema = z.object({
  text: z.string().min(1),
  category: z.string().optional(),
  courtLevel: z.string().optional(),
  caseTrack: z.string().optional(),
});

const UrlBodySchema = z.object({
  url: z.string().url(),
  category: z.string().optional(),
  courtLevel: z.string().optional(),
  caseTrack: z.string().optional(),
});

virtualCourt2ImportRouter.post(
  '/import/from-text',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY' });
        return;
      }
      const body = TextBodySchema.parse(req.body);
      const data = await importFromPastedText(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

virtualCourt2ImportRouter.post(
  '/import/from-url',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY' });
        return;
      }
      const body = UrlBodySchema.parse(req.body);
      const data = await importFromUrl(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

virtualCourt2ImportRouter.post(
  '/import/from-category',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY' });
        return;
      }
      const body = CategoryFields.parse(req.body);
      const data = await importFromCategoryWithOptionalSearch(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

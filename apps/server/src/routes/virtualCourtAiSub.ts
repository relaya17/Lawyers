import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import {
  isLlmConfigured,
  llmGenerateCase,
  llmJudgeAnalysis,
} from '../services/virtualCourtOpenAI.js';

export const virtualCourtAiSubRouter = Router();

const GenerateBodySchema = z.object({
  topic: z.string().min(1),
  track: z.string(),
  level: z.string(),
  judgeMode: z.string(),
});

const JudgeBodySchema = z.object({
  issue: z.string(),
  legalCase: z.object({
    title: z.string(),
    level: z.string(),
    track: z.string(),
    summary: z.string(),
    facts: z.array(z.string()),
    claims: z.array(z.string()),
    defenses: z.array(z.string()),
    referenceStatutes: z.array(z.unknown()),
    referencePrecedents: z.array(z.unknown()),
  }),
});

virtualCourtAiSubRouter.post(
  '/generate-case',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY on the server' });
        return;
      }
      const body = GenerateBodySchema.parse(req.body);
      const data = await llmGenerateCase(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

virtualCourtAiSubRouter.post(
  '/judge-analysis',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY on the server' });
        return;
      }
      const body = JudgeBodySchema.parse(req.body);
      const data = await llmJudgeAnalysis({
        issue: body.issue,
        caseJson: body.legalCase,
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

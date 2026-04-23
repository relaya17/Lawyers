import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import {
  isLlmConfigured,
  llmGenerateCase,
  llmJudgeAnalysis,
} from '../services/virtualCourtOpenAI.js';
import { broadcastAiResponse, broadcastAiTyping } from '../realtime/socketServer.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireEntitlement } from '../middleware/requirePremium.js';
import { requireAiMarginalBudget } from '../middleware/requireAiMarginalBudget.js';

export const virtualCourtAiSubRouter = Router();

const GenerateBodySchema = z.object({
  topic: z.string().min(1),
  track: z.string(),
  level: z.string(),
  judgeMode: z.string(),
  caseId: z.string().optional(),
});

const JudgeBodySchema = z.object({
  issue: z.string(),
  caseId: z.string().optional(),
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
  requireAuth,
  requireEntitlement('virtualCourtFull'),
  requireAiMarginalBudget(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY on the server' });
        return;
      }
      const body = GenerateBodySchema.parse(req.body);
      if (body.caseId) broadcastAiTyping({ caseId: body.caseId, role: 'judge' });
      const data = await llmGenerateCase(body);
      if (body.caseId) {
        broadcastAiResponse({
          caseId: body.caseId,
          role: 'judge',
          content: typeof data === 'object' ? JSON.stringify(data) : String(data),
        });
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

virtualCourtAiSubRouter.post(
  '/judge-analysis',
  requireAuth,
  requireEntitlement('virtualCourtFull'),
  requireAiMarginalBudget(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLlmConfigured()) {
        res.status(503).json({ error: 'LLM not configured', hint: 'Set OPENAI_API_KEY on the server' });
        return;
      }
      const body = JudgeBodySchema.parse(req.body);
      if (body.caseId) broadcastAiTyping({ caseId: body.caseId, role: 'judge' });
      const data = await llmJudgeAnalysis({
        issue: body.issue,
        caseJson: body.legalCase,
      });
      if (body.caseId) {
        broadcastAiResponse({
          caseId: body.caseId,
          role: 'judge',
          content: typeof data === 'object' ? JSON.stringify(data) : String(data),
        });
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

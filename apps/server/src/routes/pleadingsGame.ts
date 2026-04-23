import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllCases,
  getCaseById,
  getCasesByDifficulty,
  getHintForStage,
  evaluatePleadingWithAI,
  FUNDAMENTAL_RIGHTS,
  LEGAL_PHRASES,
  type GameStage,
  type PlayerRole,
  type Difficulty,
} from '../services/pleadingsGameService.js';

export const pleadingsGameRouter = Router();

const limit = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

// GET /api/pleadings-game/cases
pleadingsGameRouter.get('/cases', limit, (_req, res) => {
  res.json({ cases: getAllCases() });
});

// GET /api/pleadings-game/cases/:id
pleadingsGameRouter.get('/cases/:id', limit, (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: 'תיק לא נמצא' });
    return;
  }
  res.json({ case: c });
});

// GET /api/pleadings-game/cases/difficulty/:level
pleadingsGameRouter.get('/cases/difficulty/:level', limit, (req, res) => {
  const level = req.params.level as Difficulty;
  res.json({ cases: getCasesByDifficulty(level) });
});

// GET /api/pleadings-game/rights
pleadingsGameRouter.get('/rights', limit, (_req, res) => {
  res.json({ rights: FUNDAMENTAL_RIGHTS });
});

// GET /api/pleadings-game/phrases/:stage
pleadingsGameRouter.get('/phrases/:stage', limit, (req, res) => {
  const stage = req.params.stage as GameStage;
  const phrases = LEGAL_PHRASES[stage];
  if (!phrases) {
    res.status(400).json({ error: 'שלב לא תקין' });
    return;
  }
  res.json({ phrases });
});

// POST /api/pleadings-game/hint
pleadingsGameRouter.post('/hint', limit, (req, res) => {
  const { stage, role } = req.body as { stage?: GameStage; role?: PlayerRole };
  if (!stage || !role) {
    res.status(400).json({ error: 'חסרים פרמטרים: stage, role' });
    return;
  }
  const hint = getHintForStage(stage, role);
  res.json(hint);
});

// POST /api/pleadings-game/evaluate
pleadingsGameRouter.post('/evaluate', limit, async (req, res, next) => {
  try {
    const { text, stage, role, caseId } = req.body as {
      text?: string;
      stage?: GameStage;
      role?: PlayerRole;
      caseId?: string;
    };
    if (!text || !stage || !role || !caseId) {
      res.status(400).json({ error: 'חסרים: text, stage, role, caseId' });
      return;
    }
    if (text.trim().length < 10) {
      res.status(400).json({ error: 'כתב הטענות קצר מדי (מינימום 10 תווים)' });
      return;
    }
    const caseScenario = getCaseById(caseId);
    if (!caseScenario) {
      res.status(404).json({ error: 'תיק לא נמצא' });
      return;
    }
    const result = await evaluatePleadingWithAI(text, stage, role, caseScenario);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

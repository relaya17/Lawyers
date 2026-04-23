import { Router, type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { VirtualCourtCaseSnapshot } from '../models/VirtualCourtCaseSnapshot.js';

export const virtualCourt2SyncRouter = Router();

function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}

const PutBodySchema = z.object({
  payload: z.unknown(),
});

virtualCourt2SyncRouter.put(
  '/cases/:caseId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const { caseId } = req.params;
      const { payload } = PutBodySchema.parse(req.body);

      await VirtualCourtCaseSnapshot.findOneAndUpdate(
        { caseId },
        { caseId, payload, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      res.json({ ok: true, caseId, updatedAt: new Date().toISOString() });
    } catch (err) {
      next(err);
    }
  }
);

virtualCourt2SyncRouter.get(
  '/cases/:caseId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const { caseId } = req.params;
      const doc = await VirtualCourtCaseSnapshot.findOne({ caseId })
        .lean()
        .exec();
      const row = doc as { payload?: unknown } | null;
      if (!row?.payload) {
        res.status(404).json({ error: 'Snapshot not found' });
        return;
      }
      res.json(row.payload);
    } catch (err) {
      next(err);
    }
  }
);

import { Router, type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { VirtualCourtCaseSnapshot } from '../models/VirtualCourtCaseSnapshot.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { broadcastCourtAnnouncement } from '../realtime/socketServer.js';

export const virtualCourt2SyncRouter = Router();

function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}

const PutBodySchema = z.object({
  payload: z.unknown(),
});

const AnnounceBodySchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(8000),
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

/** הודעה בזמן אמת לכל מי שמחובר לחדר התיק (Socket.io). דורש התחברות. */
virtualCourt2SyncRouter.post(
  '/cases/:caseId/announce',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { caseId } = req.params;
      const { title, body } = AnnounceBodySchema.parse(req.body);
      const user = req.authUser!;
      const fromName =
        [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
      broadcastCourtAnnouncement({
        caseId,
        title,
        body,
        fromUserId: user.id,
        fromName,
      });
      res.json({ ok: true, caseId });
    } catch (err) {
      next(err);
    }
  },
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

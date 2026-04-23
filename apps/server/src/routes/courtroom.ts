/**
 * Live Courtroom — REST routes (Phase 1).
 *
 * Endpoints:
 *  POST   /api/courtroom/sessions                     — create new live session
 *  GET    /api/courtroom/sessions/:id                 — get session state
 *  POST   /api/courtroom/sessions/:id/join            — join with role + color
 *  POST   /api/courtroom/sessions/:id/leave           — leave
 *  POST   /api/courtroom/sessions/:id/start           — start hearing
 *  POST   /api/courtroom/sessions/:id/end             — end hearing
 *  POST   /api/courtroom/sessions/:id/protocol        — add protocol line
 *  PATCH  /api/courtroom/sessions/:id/protocol/:lineId— edit protocol line
 *  POST   /api/courtroom/sessions/:id/evidence        — add evidence
 *  POST   /api/courtroom/sessions/:id/evidence/:eid/present — present to all
 *  POST   /api/courtroom/sessions/:id/evidence/:eid/hide    — hide
 *  GET    /api/courtroom/sessions/:id/export          — text export
 */
import { Router, type Request, type Response, type NextFunction, raw as rawBody } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CourtroomSession } from '../models/CourtroomSession.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { getUserFromBearer } from '../auth/authService.js';
import { getColorForRole } from '../courtroom/roleColors.js';
import {
  suggestNextProtocolLine,
  transcribeAudio,
} from '../courtroom/courtroomAIService.js';
import {
  broadcastProtocolLine,
  broadcastProtocolEdit,
  broadcastEvidencePresent,
  broadcastEvidenceHide,
  broadcastRoleAssigned,
  broadcastHearingStart,
  broadcastHearingEnd,
} from '../realtime/socketServer.js';

export const courtroomRouter = Router();

function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type Role = string;

/** האם תפקיד זה שייך לסגל התביעה */
function isProsecution(role: Role): boolean {
  return role === 'prosecutor' || role === 'plaintiff_lawyer' || role === 'plaintiff';
}

/** האם תפקיד זה שייך לסגל ההגנה */
function isDefense(role: Role): boolean {
  return role === 'defense_lawyer' || role === 'defendant';
}

/** האם תפקיד זה שייך לשופטים/מזכירות */
function isJudicial(role: Role): boolean {
  return role === 'judge' || role === 'student_judge' || role === 'ai_judge' || role === 'clerk';
}

interface RawSession {
  _id?: unknown;
  mode?: string;
  participants?: Array<{ userId: string; role: Role; leftAt?: Date }>;
  evidence?: Array<{ accessLevel?: string }>;
  protocol?: unknown[];
  [k: string]: unknown;
}

/**
 * מחיל בקרת גישה על סשן לפי המשתמש המחובר:
 *  - closed_doors: רק סגל משפטי רואה את הפרוטוקול/ראיות; אחרים מקבלים רשימות ריקות.
 *  - ראיות מוגבלות (judges_only / prosecution_only / defense_only) — מסונן לפי תפקיד המשתמש.
 * לא מבצעים blocking: תמיד מחזירים את המטא-דאטה של הסשן, רק מסתירים תוכן.
 */
async function filterSessionForViewer(
  rawDoc: unknown,
  authHeader?: string,
): Promise<RawSession> {
  const session = rawDoc as RawSession;
  let userId: string | undefined;
  try {
    const user = await getUserFromBearer(authHeader);
    userId = user.id;
  } catch {
    userId = undefined;
  }

  const viewer = session.participants?.find((p) => p.userId === userId && !p.leftAt);
  const viewerRole: Role = viewer?.role ?? 'observer';
  const mode = session.mode ?? 'open';

  const judicial = isJudicial(viewerRole);
  const prosec = isProsecution(viewerRole);
  const defense = isDefense(viewerRole);

  if (mode === 'closed_doors' && !judicial && !prosec && !defense) {
    return {
      ...session,
      protocol: [],
      evidence: [],
    };
  }

  const filteredEvidence = (session.evidence ?? []).filter((ev) => {
    const level = ev.accessLevel ?? 'all';
    if (level === 'all') return true;
    if (level === 'judges_only') return judicial;
    if (level === 'prosecution_only') return judicial || prosec;
    if (level === 'defense_only') return judicial || defense;
    return true;
  });

  return { ...session, evidence: filteredEvidence };
}

const ParticipantRoleEnum = z.enum([
  'judge',
  'student_judge',
  'ai_judge',
  'prosecutor',
  'plaintiff_lawyer',
  'defense_lawyer',
  'plaintiff',
  'defendant',
  'witness',
  'expert',
  'clerk',
  'mediator',
  'observer',
]);

// ---------- Create session ----------
const CreateSessionSchema = z.object({
  caseId: z.string().min(1),
  hearingId: z.string().min(1),
  title: z.string().min(1).max(300),
  courtLevel: z.enum(['magistrate', 'district', 'supreme']),
  caseTrack: z.enum([
    'civil',
    'criminal',
    'administrative',
    'labor',
    'family',
    'commercial_mediation',
    'plea_bargain',
  ]),
  mode: z.enum(['open', 'closed_doors', 'appeal', 'mediation']).default('open'),
});

courtroomRouter.post(
  '/sessions',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const body = CreateSessionSchema.parse(req.body);
      const doc = await CourtroomSession.findOneAndUpdate(
        { caseId: body.caseId, hearingId: body.hearingId },
        {
          $setOnInsert: {
            caseId: body.caseId,
            hearingId: body.hearingId,
            title: body.title,
            courtLevel: body.courtLevel,
            caseTrack: body.caseTrack,
            mode: body.mode,
            status: 'scheduled',
            participants: [],
            protocol: [],
            evidence: [],
          },
        },
        { upsert: true, new: true },
      ).lean();
      res.json(doc);
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Get session (with access filtering) ----------
courtroomRouter.get(
  '/sessions/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const doc = await CourtroomSession.findById(req.params.id).lean();
      if (!doc) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const filtered = await filterSessionForViewer(doc, req.headers.authorization);
      res.json(filtered);
    } catch (e) {
      next(e);
    }
  },
);

// ---------- List sessions (optional filter by caseId) ----------
courtroomRouter.get(
  '/sessions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const filter: Record<string, string> = {};
      if (typeof req.query.caseId === 'string') filter.caseId = req.query.caseId;
      if (typeof req.query.status === 'string') filter.status = req.query.status;
      const docs = await CourtroomSession.find(filter).sort({ updatedAt: -1 }).limit(50).lean();
      res.json(docs);
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Join session ----------
const JoinSchema = z.object({
  role: ParticipantRoleEnum,
  displayName: z.string().min(1).max(120),
  avatarUrl: z.string().url().optional(),
});

courtroomRouter.post(
  '/sessions/:id/join',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const body = JoinSchema.parse(req.body);
      const user = req.authUser!;
      const color = getColorForRole(body.role);

      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const participants = session.participants as Array<{ userId: string; role?: string }>;
      const existingIdx = participants.findIndex((p) => p.userId === user.id);
      const entry = {
        userId: user.id,
        displayName: body.displayName,
        role: body.role,
        color,
        avatarUrl: body.avatarUrl,
        joinedAt: new Date(),
        isSpeaking: false,
        micEnabled: true,
        videoEnabled: true,
      };
      if (existingIdx >= 0) {
        participants[existingIdx] = entry as (typeof participants)[number];
      } else {
        participants.push(entry as (typeof participants)[number]);
      }
      await session.save();

      broadcastRoleAssigned({
        sessionId: String(session._id),
        userId: user.id,
        role: body.role,
        color,
      });

      res.json({ ok: true, color, participant: entry });
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Leave ----------
courtroomRouter.post(
  '/sessions/:id/leave',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const user = req.authUser!;
      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const participants = session.participants as Array<{ userId: string; leftAt?: Date }>;
      const p = participants.find((x) => x.userId === user.id);
      if (p) p.leftAt = new Date();
      await session.save();
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Start / End hearing ----------
courtroomRouter.post(
  '/sessions/:id/start',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const session = await CourtroomSession.findByIdAndUpdate(
        req.params.id,
        { status: 'live', startedAt: new Date() },
        { new: true },
      ).lean();
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      broadcastHearingStart(String(req.params.id));
      res.json(session);
    } catch (e) {
      next(e);
    }
  },
);

courtroomRouter.post(
  '/sessions/:id/end',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const session = await CourtroomSession.findByIdAndUpdate(
        req.params.id,
        { status: 'ended', endedAt: new Date() },
        { new: true },
      ).lean();
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      broadcastHearingEnd(String(req.params.id));
      res.json(session);
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Protocol ----------
const ProtocolAddSchema = z.object({
  text: z.string().min(1).max(4000),
  entryType: z
    .enum(['statement', 'question', 'objection', 'ruling', 'evidence', 'note', 'system'])
    .default('statement'),
  speakerUserId: z.string().optional(),
  speakerName: z.string().optional(),
  speakerRole: ParticipantRoleEnum.optional(),
  isAiGenerated: z.boolean().optional().default(false),
  aiConfidence: z.number().min(0).max(1).optional(),
});

courtroomRouter.post(
  '/sessions/:id/protocol',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const body = ProtocolAddSchema.parse(req.body);
      const user = req.authUser!;

      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const participants = session.participants as Array<{
        userId: string;
        role: string;
        color: string;
        displayName: string;
      }>;
      const speakerId = body.speakerUserId ?? user.id;
      const speaker = participants.find((p) => p.userId === speakerId);
      const role = body.speakerRole ?? speaker?.role ?? 'observer';
      const color = speaker?.color ?? getColorForRole(role);
      const fallbackName =
        [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
      const speakerName = body.speakerName ?? speaker?.displayName ?? fallbackName;

      const line = {
        lineId: uid('ln'),
        ts: new Date(),
        speakerUserId: speakerId,
        speakerName,
        speakerRole: role,
        color,
        text: body.text,
        entryType: body.entryType,
        isAiGenerated: body.isAiGenerated,
        aiConfidence: body.aiConfidence,
        verifiedBySecretary: !body.isAiGenerated,
      };
      (session.protocol as unknown as Array<typeof line>).push(line);
      await session.save();

      broadcastProtocolLine(String(session._id), line);
      res.json({ ok: true, line });
    } catch (e) {
      next(e);
    }
  },
);

const ProtocolEditSchema = z.object({
  text: z.string().min(1).max(4000),
});

courtroomRouter.patch(
  '/sessions/:id/protocol/:lineId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const body = ProtocolEditSchema.parse(req.body);
      const user = req.authUser!;
      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const lines = session.protocol as Array<{
        lineId: string;
        text: string;
        editedBy?: string;
        editedAt?: Date;
        verifiedBySecretary?: boolean;
      }>;
      const line = lines.find((l) => l.lineId === req.params.lineId);
      if (!line) {
        res.status(404).json({ error: 'Line not found' });
        return;
      }
      line.text = body.text;
      line.editedBy = user.id;
      line.editedAt = new Date();
      line.verifiedBySecretary = true;
      await session.save();

      broadcastProtocolEdit({
        sessionId: String(session._id),
        lineId: req.params.lineId,
        text: body.text,
        editedBy: user.id,
      });

      res.json({ ok: true, line });
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Evidence ----------
const EvidenceAddSchema = z.object({
  kind: z.enum(['document', 'image', 'video', 'audio', 'confidential_report', 'exhibit']),
  title: z.string().min(1).max(300),
  description: z.string().max(4000).optional(),
  url: z.string().url().optional(),
  accessLevel: z
    .enum(['all', 'judges_only', 'prosecution_only', 'defense_only'])
    .default('all'),
});

courtroomRouter.post(
  '/sessions/:id/evidence',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const body = EvidenceAddSchema.parse(req.body);
      const user = req.authUser!;
      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const evidence = {
        evidenceId: uid('ev'),
        kind: body.kind,
        title: body.title,
        description: body.description,
        url: body.url,
        accessLevel: body.accessLevel,
        submittedByUserId: user.id,
        submittedAt: new Date(),
        currentlyPresented: false,
      };
      (session.evidence as unknown as Array<typeof evidence>).push(evidence);
      await session.save();
      res.json({ ok: true, evidence });
    } catch (e) {
      next(e);
    }
  },
);

courtroomRouter.post(
  '/sessions/:id/evidence/:eid/present',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const ev = (session.evidence as Array<{ evidenceId: string; currentlyPresented: boolean }>).find(
        (e) => e.evidenceId === req.params.eid,
      );
      if (!ev) {
        res.status(404).json({ error: 'Evidence not found' });
        return;
      }
      ev.currentlyPresented = true;
      await session.save();
      broadcastEvidencePresent(String(session._id), req.params.eid);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
);

courtroomRouter.post(
  '/sessions/:id/evidence/:eid/hide',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const session = await CourtroomSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const ev = (session.evidence as Array<{ evidenceId: string; currentlyPresented: boolean }>).find(
        (e) => e.evidenceId === req.params.eid,
      );
      if (!ev) {
        res.status(404).json({ error: 'Evidence not found' });
        return;
      }
      ev.currentlyPresented = false;
      await session.save();
      broadcastEvidenceHide(String(session._id), req.params.eid);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
);

// ---------- AI: Whisper STT ----------
// Body is the audio file as raw bytes (any audio/* content-type). Query `filename` optional.
courtroomRouter.post(
  '/sessions/:id/transcribe',
  requireAuth,
  rawBody({ type: 'audio/*', limit: '20mb' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        res.status(400).json({ error: 'Empty audio body' });
        return;
      }
      const filename =
        (typeof req.query.filename === 'string' && req.query.filename) || 'audio.webm';
      const language = typeof req.query.lang === 'string' ? req.query.lang : 'he';
      const result = await transcribeAudio(req.body, filename, language);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
);

// ---------- AI: Suggest next protocol line ----------
courtroomRouter.post(
  '/sessions/:id/ai-suggest',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const session = await CourtroomSession.findById(req.params.id).lean();
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const s = session as unknown as {
        title: string;
        courtLevel: string;
        caseTrack: string;
        protocol: Array<{ speakerName: string; speakerRole: string; text: string }>;
      };
      const recent = s.protocol.slice(-10).map((l) => ({
        speakerName: l.speakerName,
        speakerRole: l.speakerRole,
        text: l.text,
      }));
      const suggestion = await suggestNextProtocolLine({
        caseTitle: s.title,
        courtLevel: s.courtLevel,
        caseTrack: s.caseTrack,
        recentLines: recent,
      });
      res.json(suggestion);
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Export text ----------
courtroomRouter.get(
  '/sessions/:id/export',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbReady()) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }
      const session = await CourtroomSession.findById(req.params.id).lean();
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const s = session as unknown as {
        title: string;
        courtLevel: string;
        caseTrack: string;
        protocol: Array<{
          ts: Date;
          speakerName: string;
          speakerRole: string;
          text: string;
          entryType: string;
        }>;
      };
      const header = `פרוטוקול דיון\n${s.title}\nערכאה: ${s.courtLevel} | מסלול: ${s.caseTrack}\n\n`;
      const body = s.protocol
        .map(
          (l) =>
            `[${new Date(l.ts).toLocaleString('he-IL')}] [${l.entryType}] ${l.speakerRole} ${l.speakerName}: ${l.text}`,
        )
        .join('\n');
      res.type('text/plain; charset=utf-8').send(header + body);
    } catch (e) {
      next(e);
    }
  },
);

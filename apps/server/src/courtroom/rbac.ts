/**
 * Courtroom RBAC — Role-Based Access Control for the live virtual courtroom.
 *
 * Encodes Israeli courtroom procedure rules as pure policy functions so the
 * same logic can be reused by REST handlers, socket handlers, and the client
 * (when computing capabilities). Functions throw only via `assertPermission`;
 * the core `checkPermission` is a pure predicate suitable for UI gating.
 *
 * Rule families encoded here:
 *
 *  1. Role → Side mapping
 *       - judicial:   judge, student_judge, ai_judge, clerk
 *       - prosecution: prosecutor, plaintiff_lawyer, plaintiff
 *       - defense:    defense_lawyer, defendant
 *       - testimony:  witness, expert
 *       - neutral:    mediator
 *       - passive:    observer
 *
 *  2. Mode constraints
 *       - "open":         all roles allowed
 *       - "closed_doors": observers not allowed to JOIN; read access also
 *                         gated for non-legal parties (see filterSessionForViewer)
 *       - "appeal":       no witnesses; no new evidence can be introduced
 *       - "mediation":    no judges; mediator is the authority
 *
 *  3. Action-level gates — see CourtroomAction below.
 */

export type CourtroomRole =
  | 'judge'
  | 'student_judge'
  | 'ai_judge'
  | 'clerk'
  | 'prosecutor'
  | 'plaintiff_lawyer'
  | 'defense_lawyer'
  | 'plaintiff'
  | 'defendant'
  | 'witness'
  | 'expert'
  | 'mediator'
  | 'observer';

export type SessionMode = 'open' | 'closed_doors' | 'appeal' | 'mediation';
export type CourtLevel = 'magistrate' | 'district' | 'supreme';
export type EvidenceAccess = 'all' | 'judges_only' | 'prosecution_only' | 'defense_only';

export type CourtroomAction =
  | 'session:start'
  | 'session:end'
  | 'session:change_mode'
  | 'session:join'
  | 'protocol:add'
  | 'protocol:edit'
  | 'protocol:delete'
  | 'evidence:add'
  | 'evidence:present'
  | 'evidence:hide'
  | 'ai:suggest'
  | 'ai:transcribe';

export interface SessionLike {
  mode: SessionMode;
  courtLevel: CourtLevel;
  caseTrack?: string;
  status?: string;
  participants: Array<{
    userId: string;
    role: CourtroomRole;
    leftAt?: Date | null;
  }>;
}

export interface PermissionPayload {
  /** role being requested on session:join */
  requestedRole?: CourtroomRole;
  /** mode being requested on session:change_mode */
  requestedMode?: SessionMode;
  /** speaker identity when adding a protocol line */
  targetSpeakerUserId?: string;
  /** metadata when editing a protocol line */
  targetLineAuthorId?: string;
  targetLineCreatedAt?: Date;
  /** access level on evidence:add */
  evidenceAccessLevel?: EvidenceAccess;
  /** submitter of an evidence item on present/hide */
  evidenceSubmittedBy?: string;
  evidenceAccessLevelExisting?: EvidenceAccess;
}

export interface PermissionContext {
  action: CourtroomAction;
  userId: string;
  session: SessionLike;
  payload?: PermissionPayload;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  reasonCode?:
    | 'NOT_A_PARTICIPANT'
    | 'ROLE_FORBIDDEN'
    | 'MODE_FORBIDDEN'
    | 'JUDICIAL_ONLY'
    | 'WRONG_SIDE'
    | 'IDENTITY_SPOOF'
    | 'EDIT_WINDOW_CLOSED'
    | 'APPEAL_NO_EVIDENCE'
    | 'APPEAL_NO_WITNESS'
    | 'OBSERVER_NOT_ALLOWED'
    | 'JUDGE_NOT_ALLOWED_IN_MEDIATION'
    | 'GENERIC';
}

// ---------- Role classification helpers ----------
const JUDICIAL_ROLES: ReadonlySet<CourtroomRole> = new Set([
  'judge',
  'student_judge',
  'ai_judge',
  'clerk',
]);

const PROSECUTION_ROLES: ReadonlySet<CourtroomRole> = new Set([
  'prosecutor',
  'plaintiff_lawyer',
  'plaintiff',
]);

const DEFENSE_ROLES: ReadonlySet<CourtroomRole> = new Set([
  'defense_lawyer',
  'defendant',
]);

const TESTIMONY_ROLES: ReadonlySet<CourtroomRole> = new Set(['witness', 'expert']);

export function isJudicialRole(role: CourtroomRole): boolean {
  return JUDICIAL_ROLES.has(role);
}
export function isProsecutionRole(role: CourtroomRole): boolean {
  return PROSECUTION_ROLES.has(role);
}
export function isDefenseRole(role: CourtroomRole): boolean {
  return DEFENSE_ROLES.has(role);
}
export function isTestimonyRole(role: CourtroomRole): boolean {
  return TESTIMONY_ROLES.has(role);
}
export function isJudgeRole(role: CourtroomRole): boolean {
  return role === 'judge' || role === 'student_judge' || role === 'ai_judge';
}

/** Active participant record for a user, or undefined if they have no active seat. */
function findActiveParticipant(
  session: SessionLike,
  userId: string,
): SessionLike['participants'][number] | undefined {
  return session.participants.find((p) => p.userId === userId && !p.leftAt);
}

// ---------- Core policy ----------
function allow(): PermissionResult {
  return { allowed: true };
}
function deny(
  reason: string,
  reasonCode: NonNullable<PermissionResult['reasonCode']> = 'GENERIC',
): PermissionResult {
  return { allowed: false, reason, reasonCode };
}

/**
 * Pure permission check. Does not throw. UI code can call this to toggle
 * buttons; server handlers should call `assertPermission` which throws a
 * tagged HTTP 403 error.
 */
export function checkPermission(ctx: PermissionContext): PermissionResult {
  const { action, userId, session, payload = {} } = ctx;
  const viewer = findActiveParticipant(session, userId);
  const viewerRole = viewer?.role;
  const mode = session.mode;

  // --- session:join ---
  // Joining is the only action that's valid before the user has a role.
  if (action === 'session:join') {
    const requested = payload.requestedRole;
    if (!requested) return deny('חסר תפקיד מבוקש');

    if (mode === 'closed_doors' && requested === 'observer') {
      return deny('בדיון בדלתיים סגורות אין משקיפים', 'OBSERVER_NOT_ALLOWED');
    }
    if (mode === 'appeal' && (requested === 'witness' || requested === 'expert')) {
      return deny('בערעור אין שמיעת עדים', 'APPEAL_NO_WITNESS');
    }
    if (mode === 'mediation' && isJudgeRole(requested)) {
      return deny('בגישור אין שופט יושב בדין', 'JUDGE_NOT_ALLOWED_IN_MEDIATION');
    }
    if (mode !== 'mediation' && requested === 'mediator') {
      return deny('תפקיד מגשר רלוונטי רק בגישור', 'MODE_FORBIDDEN');
    }
    return allow();
  }

  // All other actions require an active participant.
  if (!viewerRole) {
    return deny('אינך משתתף בדיון זה', 'NOT_A_PARTICIPANT');
  }

  // --- Session lifecycle: judge only ---
  if (action === 'session:start' || action === 'session:end') {
    if (!isJudicialRole(viewerRole)) {
      return deny('רק השופט/מזכיר רשאי לפתוח או לסיים דיון', 'JUDICIAL_ONLY');
    }
    if (action === 'session:start' && mode === 'mediation' && viewerRole !== 'mediator') {
      return deny('בגישור, רק המגשר פותח את הישיבה', 'MODE_FORBIDDEN');
    }
    return allow();
  }

  if (action === 'session:change_mode') {
    if (!isJudgeRole(viewerRole) && viewerRole !== 'mediator') {
      return deny('רק שופט רשאי לשנות מצב דיון', 'JUDICIAL_ONLY');
    }
    return allow();
  }

  // --- Protocol ---
  if (action === 'protocol:add') {
    if (viewerRole === 'observer') {
      return deny('משקיף לא רשאי להוסיף לפרוטוקול', 'ROLE_FORBIDDEN');
    }
    const targetSpeaker = payload.targetSpeakerUserId ?? userId;
    if (targetSpeaker !== userId && !isJudicialRole(viewerRole)) {
      // Only judge/clerk can log words on behalf of someone else (used for
      // AI transcription by the clerk / correction by judge).
      return deny('אין אפשרות להזין פרוטוקול בשם משתתף אחר', 'IDENTITY_SPOOF');
    }
    return allow();
  }

  if (action === 'protocol:edit') {
    if (isJudicialRole(viewerRole)) return allow();
    const authorId = payload.targetLineAuthorId;
    const created = payload.targetLineCreatedAt;
    if (!authorId || authorId !== userId) {
      return deny('רק המזכיר/שופט רשאים לתקן פרוטוקול של אחרים', 'JUDICIAL_ONLY');
    }
    if (created) {
      const ageSec = (Date.now() - created.getTime()) / 1000;
      if (ageSec > 120) {
        return deny('חלון העריכה העצמית (שתי דקות) הסתיים', 'EDIT_WINDOW_CLOSED');
      }
    }
    return allow();
  }

  if (action === 'protocol:delete') {
    if (!isJudgeRole(viewerRole)) {
      return deny('רק שופט רשאי למחוק שורת פרוטוקול', 'JUDICIAL_ONLY');
    }
    return allow();
  }

  // --- Evidence ---
  if (action === 'evidence:add') {
    if (mode === 'appeal') {
      return deny('בערעור לא ניתן להציג ראיות חדשות', 'APPEAL_NO_EVIDENCE');
    }
    if (viewerRole === 'observer' || isTestimonyRole(viewerRole)) {
      return deny('תפקיד זה אינו מוסמך להגיש ראיות', 'ROLE_FORBIDDEN');
    }
    const level = payload.evidenceAccessLevel ?? 'all';
    // Judicial can post any level.
    if (isJudicialRole(viewerRole)) return allow();
    // Parties can post level "all" or their own side's level.
    if (level === 'all') return allow();
    if (level === 'judges_only') {
      return deny('רק סגל שיפוטי רשאי להגיש ראיה חסויה לשופט', 'WRONG_SIDE');
    }
    if (level === 'prosecution_only' && !isProsecutionRole(viewerRole)) {
      return deny('ראיה זו שמורה לתביעה', 'WRONG_SIDE');
    }
    if (level === 'defense_only' && !isDefenseRole(viewerRole)) {
      return deny('ראיה זו שמורה להגנה', 'WRONG_SIDE');
    }
    return allow();
  }

  if (action === 'evidence:present') {
    // Judge/clerk can present anything.
    if (isJudicialRole(viewerRole)) return allow();
    const level = payload.evidenceAccessLevelExisting ?? 'all';
    if (level === 'judges_only') {
      return deny('ראיה זו חסויה — רק השופט רשאי להציגה', 'JUDICIAL_ONLY');
    }
    if (level === 'all') {
      // Any non-observer party can present a public exhibit.
      if (viewerRole === 'observer' || isTestimonyRole(viewerRole)) {
        return deny('תפקיד זה אינו מוסמך להציג ראיות', 'ROLE_FORBIDDEN');
      }
      return allow();
    }
    if (level === 'prosecution_only' && !isProsecutionRole(viewerRole)) {
      return deny('ראיה זו שמורה לתביעה', 'WRONG_SIDE');
    }
    if (level === 'defense_only' && !isDefenseRole(viewerRole)) {
      return deny('ראיה זו שמורה להגנה', 'WRONG_SIDE');
    }
    return allow();
  }

  if (action === 'evidence:hide') {
    if (isJudgeRole(viewerRole)) return allow();
    if (payload.evidenceSubmittedBy === userId) return allow();
    return deny('רק מגיש הראיה או שופט רשאים להסתיר אותה', 'WRONG_SIDE');
  }

  // --- AI ---
  if (action === 'ai:transcribe') {
    if (viewerRole === 'observer') {
      return deny('משקיפים לא יכולים להזרים שמע לתמלול', 'ROLE_FORBIDDEN');
    }
    return allow();
  }
  if (action === 'ai:suggest') {
    if (!isJudicialRole(viewerRole)) {
      return deny('הצעת AI לשורה הבאה זמינה רק למזכיר/שופט', 'JUDICIAL_ONLY');
    }
    return allow();
  }

  return deny('פעולה לא מוכרת', 'GENERIC');
}

/**
 * HTTP error with .status=403 suitable for Express error middleware.
 * Routes should `throw assertPermission(ctx)` or `if (!check.allowed) throw ...`.
 */
export class CourtroomForbiddenError extends Error {
  public readonly status = 403;
  public readonly code: NonNullable<PermissionResult['reasonCode']>;
  constructor(result: PermissionResult) {
    super(result.reason ?? 'Forbidden');
    this.name = 'CourtroomForbiddenError';
    this.code = result.reasonCode ?? 'GENERIC';
  }
}

export function assertPermission(ctx: PermissionContext): void {
  const r = checkPermission(ctx);
  if (!r.allowed) throw new CourtroomForbiddenError(r);
}

// ---------- Client capabilities ----------
export interface CourtroomCapabilities {
  role: CourtroomRole | null;
  isJudicial: boolean;
  isProsecution: boolean;
  isDefense: boolean;
  isTestimony: boolean;
  canStart: boolean;
  canEnd: boolean;
  canChangeMode: boolean;
  canAddProtocol: boolean;
  canEditAnyProtocol: boolean;
  canDeleteProtocol: boolean;
  canAddEvidence: boolean;
  canPresentAny: boolean;
  canSuggestAiLine: boolean;
  canTranscribe: boolean;
}

/** Snapshot of what the given user is allowed to do in the session right now. */
export function computeCapabilities(
  session: SessionLike,
  userId: string | undefined,
): CourtroomCapabilities {
  const viewer = userId ? findActiveParticipant(session, userId) : undefined;
  const role = viewer?.role ?? null;
  const base: CourtroomCapabilities = {
    role,
    isJudicial: role ? isJudicialRole(role) : false,
    isProsecution: role ? isProsecutionRole(role) : false,
    isDefense: role ? isDefenseRole(role) : false,
    isTestimony: role ? isTestimonyRole(role) : false,
    canStart: false,
    canEnd: false,
    canChangeMode: false,
    canAddProtocol: false,
    canEditAnyProtocol: false,
    canDeleteProtocol: false,
    canAddEvidence: false,
    canPresentAny: false,
    canSuggestAiLine: false,
    canTranscribe: false,
  };
  if (!userId) return base;

  const probe = (action: CourtroomAction, payload?: PermissionPayload): boolean =>
    checkPermission({ action, userId, session, payload }).allowed;

  return {
    ...base,
    canStart: probe('session:start'),
    canEnd: probe('session:end'),
    canChangeMode: probe('session:change_mode'),
    canAddProtocol: probe('protocol:add'),
    canEditAnyProtocol: probe('protocol:edit', {
      targetLineAuthorId: '__other__',
    }),
    canDeleteProtocol: probe('protocol:delete'),
    canAddEvidence: probe('evidence:add', { evidenceAccessLevel: 'all' }),
    canPresentAny: probe('evidence:present', { evidenceAccessLevelExisting: 'all' }),
    canSuggestAiLine: probe('ai:suggest'),
    canTranscribe: probe('ai:transcribe'),
  };
}

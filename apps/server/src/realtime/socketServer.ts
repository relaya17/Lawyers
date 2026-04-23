import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyAccessToken } from '../auth/jwtTokens.js';

let io: SocketIOServer | null = null;

export interface CourtSocketData {
  userId: string;
  email: string;
}

/**
 * Events the SERVER emits to CLIENTS.
 * Keep in sync with `apps/web/src/features/realtime/types.ts`.
 */
export interface ServerToClientEvents {
  'court:ai_typing': (p: { caseId: string; role: 'judge' | 'witness' | 'counsel' }) => void;
  'court:ai_response': (p: {
    caseId: string;
    role: 'judge' | 'witness' | 'counsel';
    content: string;
    ts: number;
  }) => void;
  'court:timeline_event': (p: { caseId: string; event: unknown; ts: number }) => void;
  'court:participant_joined': (p: { caseId: string; userId: string; ts: number }) => void;
  'court:participant_left': (p: { caseId: string; userId: string; ts: number }) => void;
  'court:announcement': (p: {
    caseId: string;
    title: string;
    body: string;
    fromUserId: string;
    fromName: string;
    ts: number;
  }) => void;
  'notification:new': (p: { id: string; title: string; body: string; ts: number }) => void;
}

export interface ClientToServerEvents {
  'court:join': (caseId: string, ack?: (ok: boolean) => void) => void;
  'court:leave': (caseId: string) => void;
  'court:typing': (p: { caseId: string; isTyping: boolean }) => void;
}

function caseRoom(caseId: string): string {
  return `court:${caseId}`;
}

function userRoom(userId: string): string {
  return `user:${userId}`;
}

/**
 * Attach a Socket.io server to an existing HTTP server.
 * Auth: the client sends its JWT access token via `auth.token` on `io(...)`.
 */
export function attachSocketServer(httpServer: HttpServer): SocketIOServer {
  const corsOriginEnv = process.env.CORS_ORIGIN;
  const corsOrigins = corsOriginEnv
    ? corsOriginEnv.split(',').map((s) => s.trim()).filter(Boolean)
    : ['http://localhost:5852', 'http://localhost:5173'];

  io = new SocketIOServer(httpServer, {
    path: '/socket.io',
    cors: {
      origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth as { token?: string } | undefined)?.token ??
        (socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '') ?? '');
      if (!token) return next(new Error('missing_token'));
      const payload = verifyAccessToken(token);
      const data = socket.data as CourtSocketData;
      data.userId = payload.sub;
      data.email = payload.email;
      next();
    } catch {
      next(new Error('invalid_token'));
    }
  });

  io.on('connection', (socket) => {
    const data = socket.data as CourtSocketData;
    void socket.join(userRoom(data.userId));

    socket.on('court:join', (caseId: string, ack?: (ok: boolean) => void) => {
      if (!caseId || typeof caseId !== 'string') {
        ack?.(false);
        return;
      }
      void socket.join(caseRoom(caseId));
      ack?.(true);
      io?.to(caseRoom(caseId)).emit('court:participant_joined', {
        caseId,
        userId: data.userId,
        ts: Date.now(),
      });
    });

    socket.on('court:leave', (caseId: string) => {
      void socket.leave(caseRoom(caseId));
      io?.to(caseRoom(caseId)).emit('court:participant_left', {
        caseId,
        userId: data.userId,
        ts: Date.now(),
      });
    });

    socket.on('court:typing', (payload: { caseId: string; isTyping: boolean }) => {
      if (!payload?.isTyping) return;
      io?.to(caseRoom(payload.caseId)).emit('court:ai_typing', {
        caseId: payload.caseId,
        role: 'counsel',
      });
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

/** Broadcast a new AI response to everyone in a court case. */
export function broadcastAiResponse(params: {
  caseId: string;
  role: 'judge' | 'witness' | 'counsel';
  content: string;
}): void {
  io?.to(caseRoom(params.caseId)).emit('court:ai_response', {
    caseId: params.caseId,
    role: params.role,
    content: params.content,
    ts: Date.now(),
  });
}

/** Broadcast that the AI started "thinking" so clients can show a typing indicator. */
export function broadcastAiTyping(params: {
  caseId: string;
  role: 'judge' | 'witness' | 'counsel';
}): void {
  io?.to(caseRoom(params.caseId)).emit('court:ai_typing', {
    caseId: params.caseId,
    role: params.role,
  });
}

/** Broadcast a case timeline event (note, message, evidence…). */
export function broadcastTimelineEvent(caseId: string, event: unknown): void {
  io?.to(caseRoom(caseId)).emit('court:timeline_event', {
    caseId,
    event,
    ts: Date.now(),
  });
}

/** Instructor / any authenticated client: message everyone currently in the case room. */
export function broadcastCourtAnnouncement(params: {
  caseId: string;
  title: string;
  body: string;
  fromUserId: string;
  fromName: string;
}): void {
  const ts = Date.now();
  io?.to(caseRoom(params.caseId)).emit('court:announcement', {
    caseId: params.caseId,
    title: params.title,
    body: params.body,
    fromUserId: params.fromUserId,
    fromName: params.fromName,
    ts,
  });
}

/** Send a notification to a specific user across all their tabs. */
export function notifyUser(
  userId: string,
  payload: { id: string; title: string; body: string },
): void {
  io?.to(userRoom(userId)).emit('notification:new', { ...payload, ts: Date.now() });
}

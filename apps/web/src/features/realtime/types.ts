/**
 * Shared event shapes between the web client and the Node server.
 * Must stay in sync with `apps/server/src/realtime/socketServer.ts`.
 */

export type CourtAiRole = 'judge' | 'witness' | 'counsel'

export interface ServerToClientEvents {
  'court:ai_typing': (p: { caseId: string; role: CourtAiRole }) => void
  'court:ai_response': (p: {
    caseId: string
    role: CourtAiRole
    content: string
    ts: number
  }) => void
  'court:timeline_event': (p: { caseId: string; event: unknown; ts: number }) => void
  'court:participant_joined': (p: { caseId: string; userId: string; ts: number }) => void
  'court:participant_left': (p: { caseId: string; userId: string; ts: number }) => void
  'court:announcement': (p: {
    caseId: string
    title: string
    body: string
    fromUserId: string
    fromName: string
    ts: number
  }) => void
  'notification:new': (p: { id: string; title: string; body: string; ts: number }) => void
}

export interface ClientToServerEvents {
  'court:join': (caseId: string, ack?: (ok: boolean) => void) => void
  'court:leave': (caseId: string) => void
  'court:typing': (p: { caseId: string; isTyping: boolean }) => void
}

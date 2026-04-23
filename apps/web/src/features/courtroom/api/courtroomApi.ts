import { axiosClient } from '@/services/api/axiosClient'
import type {
  AccessLevel,
  CourtroomSession,
  EvidenceKind,
  EvidenceRecord,
  ProtocolEntryType,
  ProtocolLine,
} from '../types'
import type { CaseTrack, CourtLevel, ParticipantRole } from '@/features/virtual-court-2/types'

const BASE = '/courtroom/sessions'

export async function createSession(params: {
  caseId: string
  hearingId: string
  title: string
  courtLevel: CourtLevel
  caseTrack: CaseTrack
  mode?: 'open' | 'closed_doors' | 'appeal' | 'mediation'
}): Promise<CourtroomSession> {
  const res = await axiosClient.post<CourtroomSession>(BASE, params)
  return res.data
}

export async function getSession(id: string): Promise<CourtroomSession> {
  const res = await axiosClient.get<CourtroomSession>(`${BASE}/${id}`)
  return res.data
}

export async function listSessions(params?: {
  caseId?: string
  status?: string
}): Promise<CourtroomSession[]> {
  const res = await axiosClient.get<CourtroomSession[]>(BASE, { params })
  return res.data
}

export async function joinSession(
  id: string,
  body: { role: ParticipantRole; displayName: string; avatarUrl?: string },
): Promise<{ ok: boolean; color: string }> {
  const res = await axiosClient.post<{ ok: boolean; color: string }>(`${BASE}/${id}/join`, body)
  return res.data
}

export async function leaveSession(id: string): Promise<void> {
  await axiosClient.post(`${BASE}/${id}/leave`, {})
}

export async function startHearing(id: string): Promise<CourtroomSession> {
  const res = await axiosClient.post<CourtroomSession>(`${BASE}/${id}/start`, {})
  return res.data
}

export async function endHearing(id: string): Promise<CourtroomSession> {
  const res = await axiosClient.post<CourtroomSession>(`${BASE}/${id}/end`, {})
  return res.data
}

export async function addProtocolLine(
  id: string,
  body: {
    text: string
    entryType?: ProtocolEntryType
    speakerUserId?: string
    speakerName?: string
    speakerRole?: ParticipantRole
    isAiGenerated?: boolean
    aiConfidence?: number
  },
): Promise<ProtocolLine> {
  const res = await axiosClient.post<{ ok: boolean; line: ProtocolLine }>(
    `${BASE}/${id}/protocol`,
    body,
  )
  return res.data.line
}

export async function editProtocolLine(
  id: string,
  lineId: string,
  text: string,
): Promise<ProtocolLine> {
  const res = await axiosClient.patch<{ ok: boolean; line: ProtocolLine }>(
    `${BASE}/${id}/protocol/${lineId}`,
    { text },
  )
  return res.data.line
}

export async function addEvidence(
  id: string,
  body: {
    kind: EvidenceKind
    title: string
    description?: string
    url?: string
    accessLevel?: AccessLevel
  },
): Promise<EvidenceRecord> {
  const res = await axiosClient.post<{ ok: boolean; evidence: EvidenceRecord }>(
    `${BASE}/${id}/evidence`,
    body,
  )
  return res.data.evidence
}

export async function presentEvidence(id: string, evidenceId: string): Promise<void> {
  await axiosClient.post(`${BASE}/${id}/evidence/${evidenceId}/present`, {})
}

export async function hideEvidence(id: string, evidenceId: string): Promise<void> {
  await axiosClient.post(`${BASE}/${id}/evidence/${evidenceId}/hide`, {})
}

export function exportUrl(id: string): string {
  const base = axiosClient.defaults.baseURL ?? ''
  return `${base}${BASE}/${id}/export`
}

export async function transcribeAudio(
  id: string,
  blob: Blob,
  filename: string = 'audio.webm',
  language: string = 'he',
): Promise<{ text: string; language?: string; durationSec?: number }> {
  const res = await axiosClient.post<{ text: string; language?: string; durationSec?: number }>(
    `${BASE}/${id}/transcribe`,
    blob,
    {
      params: { filename, lang: language },
      headers: { 'Content-Type': blob.type || 'audio/webm' },
      transformRequest: [(data: Blob) => data],
    },
  )
  return res.data
}

export async function aiSuggestNextLine(id: string): Promise<{
  speakerRole: string
  speakerName: string
  text: string
  entryType: 'statement' | 'question' | 'objection' | 'ruling' | 'evidence' | 'note' | 'system'
}> {
  const res = await axiosClient.post(`${BASE}/${id}/ai-suggest`, {})
  return res.data as {
    speakerRole: string
    speakerName: string
    text: string
    entryType: 'statement' | 'question' | 'objection' | 'ruling' | 'evidence' | 'note' | 'system'
  }
}

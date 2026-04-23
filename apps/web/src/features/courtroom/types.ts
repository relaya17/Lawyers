import type { CaseTrack, CourtLevel, ParticipantRole } from '@/features/virtual-court-2/types'

export type SessionStatus = 'scheduled' | 'live' | 'ended'
export type SessionMode = 'open' | 'closed_doors' | 'appeal' | 'mediation'

export type ProtocolEntryType =
  | 'statement'
  | 'question'
  | 'objection'
  | 'ruling'
  | 'evidence'
  | 'note'
  | 'system'

export type EvidenceKind =
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'confidential_report'
  | 'exhibit'

export type AccessLevel = 'all' | 'judges_only' | 'prosecution_only' | 'defense_only'

export interface SessionParticipant {
  userId: string
  displayName: string
  role: ParticipantRole
  color: string
  avatarUrl?: string
  joinedAt?: string
  leftAt?: string
  isSpeaking?: boolean
  micEnabled?: boolean
  videoEnabled?: boolean
}

export interface ProtocolLine {
  lineId: string
  ts: string
  speakerUserId?: string
  speakerName: string
  speakerRole: ParticipantRole
  color: string
  text: string
  entryType: ProtocolEntryType
  isAiGenerated?: boolean
  verifiedBySecretary?: boolean
  editedBy?: string
  editedAt?: string
  aiConfidence?: number
}

export interface EvidenceRecord {
  evidenceId: string
  kind: EvidenceKind
  title: string
  description?: string
  url?: string
  submittedByUserId?: string
  submittedAt?: string
  admittedAt?: string
  accessLevel: AccessLevel
  currentlyPresented?: boolean
}

export interface CourtroomSession {
  _id: string
  caseId: string
  hearingId: string
  title: string
  status: SessionStatus
  mode: SessionMode
  courtLevel: CourtLevel
  caseTrack: CaseTrack
  participants: SessionParticipant[]
  protocol: ProtocolLine[]
  evidence: EvidenceRecord[]
  currentSpeakerUserId?: string
  startedAt?: string
  endedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type CourtLevel = 'magistrate' | 'district' | 'supreme'

export type CaseTrack =
  | 'civil'
  | 'criminal'
  | 'administrative'
  | 'labor'
  | 'family'
  | 'commercial_mediation'
  | 'plea_bargain'

export type CaseStatus =
  | 'draft'
  | 'filed'
  | 'in_hearing'
  | 'awaiting_ruling'
  | 'ruled'
  | 'appealed'
  | 'closed'

export type ParticipantRole =
  | 'judge'
  | 'student_judge'
  | 'ai_judge'
  | 'prosecutor'
  | 'plaintiff_lawyer'
  | 'defense_lawyer'
  | 'plaintiff'
  | 'defendant'
  | 'witness'
  | 'expert'
  | 'clerk'
  | 'mediator'
  | 'observer'

export type JudgeMode = 'ai' | 'student' | 'hybrid'

export interface Participant {
  id: string
  name: string
  role: ParticipantRole
  isAI: boolean
  userId?: string
  avatarUrl?: string
  bio?: string
  videoEnabled: boolean
  joinedAt: string
}

export type HearingStatus = 'scheduled' | 'live' | 'completed' | 'cancelled'

export interface Hearing {
  id: string
  title: string
  scheduledAt: string
  durationMinutes: number
  status: HearingStatus
  agenda: string[]
  participantIds: string[]
  videoRoomId?: string
  notes?: string
}

export type ProtocolEntryType =
  | 'statement'
  | 'question'
  | 'objection'
  | 'ruling'
  | 'evidence'
  | 'note'
  | 'system'

export interface ProtocolEntry {
  id: string
  hearingId?: string
  at: string
  speakerId?: string
  speakerName: string
  speakerRole: ParticipantRole
  type: ProtocolEntryType
  text: string
}

export type EvidenceKind =
  | 'document'
  | 'testimony'
  | 'expert_report'
  | 'exhibit'
  | 'video'
  | 'audio'

export interface EvidenceItem {
  id: string
  kind: EvidenceKind
  title: string
  description: string
  submittedByParticipantId?: string
  submittedAt: string
  admitted?: boolean
  notes?: string
}

export interface Precedent {
  id: string
  title: string
  citation: string
  court: CourtLevel | 'other'
  year?: number
  summary: string
  relevance: string
  sourceUrl?: string
}

export interface Statute {
  id: string
  title: string
  section?: string
  excerpt: string
  sourceUrl?: string
}

export interface AIJudgeAnalysis {
  id: string
  createdAt: string
  issue: string
  reasoning: string
  statutes: Statute[]
  precedents: Precedent[]
  holding: string
  confidence: 'low' | 'medium' | 'high'
  disclaimers: string[]
}

export interface Ruling {
  id: string
  issuedAt: string
  issuedByParticipantId: string
  issuedByName: string
  mode: JudgeMode
  verdict: string
  reasoning: string
  statutes: Statute[]
  precedents: Precedent[]
  dissent?: string
  appealable: boolean
}

export type TimelineEventType =
  | 'case_opened'
  | 'filed'
  | 'hearing_scheduled'
  | 'hearing_completed'
  | 'evidence_submitted'
  | 'ai_analysis'
  | 'ruling'
  | 'appeal'
  | 'status_change'
  | 'note'

export interface TimelineEvent {
  id: string
  at: string
  type: TimelineEventType
  title: string
  description?: string
  byParticipantId?: string
}

export type CaseSource = 'sample' | 'ai_generated' | 'user_custom' | 'web_import'

export interface CaseDocument {
  id: string
  title: string
  body: string
  createdAt: string
  kind: 'pleading' | 'motion' | 'brief' | 'opinion' | 'other'
  authorParticipantId?: string
}

export interface MediationProposal {
  id: string
  at: string
  byParticipantId: string
  summary: string
  terms: string[]
  status: 'open' | 'accepted' | 'rejected' | 'countered'
}

export interface LegalCase {
  id: string
  caseNumber: string
  title: string
  shortTitle: string
  topic: string
  track: CaseTrack
  level: CourtLevel
  status: CaseStatus
  summary: string
  facts: string[]
  claims: string[]
  defenses: string[]
  judgeMode: JudgeMode
  source: CaseSource
  createdAt: string
  updatedAt: string
  participants: Participant[]
  hearings: Hearing[]
  protocol: ProtocolEntry[]
  evidence: EvidenceItem[]
  documents: CaseDocument[]
  analyses: AIJudgeAnalysis[]
  rulings: Ruling[]
  mediations: MediationProposal[]
  timeline: TimelineEvent[]
  referencePrecedents: Precedent[]
  referenceStatutes: Statute[]
  parentCaseId?: string
}

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AIJudgeAnalysis,
  CaseStatus,
  EvidenceItem,
  Hearing,
  LegalCase,
  MediationProposal,
  Participant,
  ProtocolEntry,
  Ruling,
  TimelineEvent,
} from '../types'
import { SAMPLE_CASES } from '../data/sampleCases'

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

interface State {
  cases: LegalCase[]
}

interface Actions {
  getCase: (id: string) => LegalCase | undefined
  addCase: (c: LegalCase) => void
  removeCase: (id: string) => void
  updateCase: (id: string, patch: Partial<LegalCase>) => void
  setStatus: (id: string, status: CaseStatus) => void
  addParticipant: (id: string, p: Omit<Participant, 'id' | 'joinedAt'>) => void
  removeParticipant: (id: string, participantId: string) => void
  toggleVideo: (id: string, participantId: string) => void
  addHearing: (id: string, h: Omit<Hearing, 'id'>) => void
  updateHearing: (id: string, hearingId: string, patch: Partial<Hearing>) => void
  addProtocolEntry: (id: string, entry: Omit<ProtocolEntry, 'id' | 'at'>) => void
  addEvidence: (id: string, e: Omit<EvidenceItem, 'id' | 'submittedAt'>) => void
  admitEvidence: (id: string, evidenceId: string, admitted: boolean) => void
  addAnalysis: (id: string, a: AIJudgeAnalysis) => void
  addRuling: (id: string, r: Omit<Ruling, 'id' | 'issuedAt'>) => void
  addMediation: (id: string, m: Omit<MediationProposal, 'id' | 'at'>) => void
  updateMediationStatus: (
    id: string,
    mediationId: string,
    status: MediationProposal['status']
  ) => void
  resetToSamples: () => void
  setCase: (c: LegalCase) => void
  /** הודעת מערכת לסטודנטים — נרשמת בציר הזמן של התיק */
  addCourtAppMessage: (
    id: string,
    payload: { body: string; recipientLabel: string },
  ) => void
}

const appendTimeline = (c: LegalCase, e: Omit<TimelineEvent, 'id' | 'at'>): LegalCase => ({
  ...c,
  updatedAt: new Date().toISOString(),
  timeline: [
    ...c.timeline,
    { id: uid('tl'), at: new Date().toISOString(), ...e },
  ],
})

const mutate = (
  state: State,
  id: string,
  fn: (c: LegalCase) => LegalCase
): State => ({
  ...state,
  cases: state.cases.map((c) => (c.id === id ? fn(c) : c)),
})

export const useVirtualCourt2Store = create<State & Actions>()(
  persist(
    (set, get) => ({
      cases: SAMPLE_CASES,

      getCase: (id) => get().cases.find((c) => c.id === id),

      addCase: (c) =>
        set((s) => ({ cases: [c, ...s.cases] })),

      removeCase: (id) =>
        set((s) => ({ cases: s.cases.filter((c) => c.id !== id) })),

      updateCase: (id, patch) =>
        set((s) =>
          mutate(s, id, (c) => ({ ...c, ...patch, updatedAt: new Date().toISOString() }))
        ),

      setStatus: (id, status) =>
        set((s) =>
          mutate(s, id, (c) =>
            appendTimeline({ ...c, status }, {
              type: 'status_change',
              title: `סטטוס תיק: ${status}`,
            })
          )
        ),

      addParticipant: (id, p) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            participants: [
              ...c.participants,
              { id: uid('p'), joinedAt: new Date().toISOString(), ...p },
            ],
            updatedAt: new Date().toISOString(),
          }))
        ),

      removeParticipant: (id, participantId) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            participants: c.participants.filter((p) => p.id !== participantId),
            updatedAt: new Date().toISOString(),
          }))
        ),

      toggleVideo: (id, participantId) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            participants: c.participants.map((p) =>
              p.id === participantId ? { ...p, videoEnabled: !p.videoEnabled } : p
            ),
          }))
        ),

      addHearing: (id, h) =>
        set((s) =>
          mutate(s, id, (c) =>
            appendTimeline(
              {
                ...c,
                hearings: [...c.hearings, { id: uid('h'), ...h }],
              },
              {
                type: 'hearing_scheduled',
                title: `דיון נקבע: ${h.title}`,
                description: new Date(h.scheduledAt).toLocaleString('he-IL'),
              }
            )
          )
        ),

      updateHearing: (id, hearingId, patch) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            hearings: c.hearings.map((h) => (h.id === hearingId ? { ...h, ...patch } : h)),
          }))
        ),

      addProtocolEntry: (id, entry) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            protocol: [
              ...c.protocol,
              { id: uid('pe'), at: new Date().toISOString(), ...entry },
            ],
            updatedAt: new Date().toISOString(),
          }))
        ),

      addEvidence: (id, e) =>
        set((s) =>
          mutate(s, id, (c) =>
            appendTimeline(
              {
                ...c,
                evidence: [
                  ...c.evidence,
                  { id: uid('ev'), submittedAt: new Date().toISOString(), ...e },
                ],
              },
              { type: 'evidence_submitted', title: `הוגשה ראיה: ${e.title}` }
            )
          )
        ),

      admitEvidence: (id, evidenceId, admitted) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            evidence: c.evidence.map((ev) =>
              ev.id === evidenceId ? { ...ev, admitted } : ev
            ),
          }))
        ),

      addAnalysis: (id, a) =>
        set((s) =>
          mutate(s, id, (c) =>
            appendTimeline(
              { ...c, analyses: [a, ...c.analyses] },
              { type: 'ai_analysis', title: `ניתוח שופט AI: ${a.issue}` }
            )
          )
        ),

      addRuling: (id, r) =>
        set((s) =>
          mutate(s, id, (c) => {
            const ruling: Ruling = {
              id: uid('ru'),
              issuedAt: new Date().toISOString(),
              ...r,
            }
            return appendTimeline(
              {
                ...c,
                rulings: [ruling, ...c.rulings],
                status: 'ruled',
              },
              { type: 'ruling', title: `ניתן פס״ד: ${ruling.verdict.slice(0, 60)}` }
            )
          })
        ),

      addMediation: (id, m) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            mediations: [
              ...c.mediations,
              { id: uid('md'), at: new Date().toISOString(), ...m },
            ],
            updatedAt: new Date().toISOString(),
          }))
        ),

      updateMediationStatus: (id, mediationId, status) =>
        set((s) =>
          mutate(s, id, (c) => ({
            ...c,
            mediations: c.mediations.map((m) =>
              m.id === mediationId ? { ...m, status } : m
            ),
          }))
        ),

      resetToSamples: () => set({ cases: SAMPLE_CASES }),

      setCase: (c) =>
        set((s) => {
          const i = s.cases.findIndex((x) => x.id === c.id)
          const nextCase = { ...c, updatedAt: new Date().toISOString() }
          if (i === -1) {
            return { cases: [nextCase, ...s.cases] }
          }
          const next = [...s.cases]
          next[i] = nextCase
          return { cases: next }
        }),

      addCourtAppMessage: (id, payload) =>
        set((s) =>
          mutate(s, id, (c) =>
            appendTimeline(c, {
              type: 'note',
              title: 'הודעה לסטודנטים (באפליקציה)',
              description: `${payload.body}\n\nנמענים: ${payload.recipientLabel}`,
            }),
          ),
        ),
    }),
    {
      name: 'virtual-court-2/cases/v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

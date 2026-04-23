import type { CaseTrack, CourtLevel, LegalCase, Precedent, Statute } from '../types'

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export interface RealCaseImportPayload {
  caseNumber?: string
  title: string
  shortTitle?: string
  summary: string
  facts: string[]
  claims: string[]
  defenses: string[]
  referencePrecedents: Array<{
    title: string
    citation: string
    court?: string
    year?: number
    summary: string
    relevance: string
    sourceUrl?: string
  }>
  referenceStatutes: Array<{
    title: string
    section?: string
    excerpt: string
    sourceUrl?: string
  }>
  sourceDescription: string
  anonymizationNote: string
  provenanceUrls?: string[]
}

function mapCourt(c?: string): Precedent['court'] {
  if (c === 'magistrate' || c === 'district' || c === 'supreme' || c === 'other') return c
  return 'supreme'
}

/** ממזג טיוטת ייבוא לתוך תיק קיים — שומר משתתפים, דיונים, פרוטוקול וכו׳ */
export function mergeRealImportIntoCase(
  existing: LegalCase,
  draft: RealCaseImportPayload,
  opts?: { level?: CourtLevel; track?: CaseTrack }
): LegalCase {
  const now = new Date().toISOString()

  const referencePrecedents: Precedent[] = (draft.referencePrecedents || []).map((p) => ({
    id: uid('prec'),
    title: p.title,
    citation: p.citation,
    court: mapCourt(p.court),
    year: p.year,
    summary: p.summary,
    relevance: p.relevance,
    sourceUrl: p.sourceUrl,
  }))

  const referenceStatutes: Statute[] = (draft.referenceStatutes || []).map((s) => ({
    id: uid('stat'),
    title: s.title,
    section: s.section,
    excerpt: s.excerpt,
    sourceUrl: s.sourceUrl,
  }))

  const prov = draft.provenanceUrls?.filter(Boolean).join(', ')

  return {
    ...existing,
    level: opts?.level ?? existing.level,
    track: opts?.track ?? existing.track,
    caseNumber: draft.caseNumber || existing.caseNumber,
    title: draft.title,
    shortTitle: draft.shortTitle || existing.shortTitle,
    summary: draft.summary,
    facts: draft.facts?.length ? draft.facts : existing.facts,
    claims: draft.claims?.length ? draft.claims : existing.claims,
    defenses: draft.defenses?.length ? draft.defenses : existing.defenses,
    referencePrecedents,
    referenceStatutes,
    source: 'web_import',
    updatedAt: now,
    topic: draft.shortTitle || draft.title.slice(0, 80) || existing.topic,
    timeline: [
      ...existing.timeline,
      {
        id: uid('tl'),
        at: now,
        type: 'note',
        title: `ייבוא ממקרה אמיתי: ${draft.sourceDescription}`,
        description: [draft.anonymizationNote, prov ? `מקורות: ${prov}` : '']
          .filter(Boolean)
          .join(' · '),
      },
    ],
  }
}

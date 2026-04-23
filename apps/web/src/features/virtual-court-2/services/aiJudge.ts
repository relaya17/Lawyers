import type { AIJudgeAnalysis, LegalCase, Precedent, Statute } from '../types'
import { fetchLlmJudgeAnalysis } from './virtualCourtRemote'

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function mapCourt(c?: string): Precedent['court'] {
  if (c === 'magistrate' || c === 'district' || c === 'supreme' || c === 'other') return c
  return 'supreme'
}

/** ניתוח מקומי כשאין LLM */
export function runAIJudgeAnalysisLocal(legalCase: LegalCase, issue: string): AIJudgeAnalysis {
  const statutes = legalCase.referenceStatutes.slice(0, 3)
  const precedents = legalCase.referencePrecedents.slice(0, 3)

  const reasoningParts: string[] = []
  reasoningParts.push(
    `הסוגיה: ${issue || 'סוגיה משפטית הדורשת הכרעה על בסיס העובדות שבפני בית המשפט.'}`
  )
  if (legalCase.facts.length) {
    reasoningParts.push('עובדות מרכזיות רלוונטיות:')
    legalCase.facts.slice(0, 5).forEach((f, i) => reasoningParts.push(`  ${i + 1}. ${f}`))
  }
  if (statutes.length) {
    reasoningParts.push('מסגרת חקיקתית:')
    statutes.forEach((s) =>
      reasoningParts.push(`  • ${s.title}${s.section ? ` (${s.section})` : ''} — ${s.excerpt}`)
    )
  }
  if (precedents.length) {
    reasoningParts.push('פסיקה רלוונטית:')
    precedents.forEach((p) =>
      reasoningParts.push(`  • ${p.title} — ${p.summary} [רלוונטיות: ${p.relevance}]`)
    )
  }
  reasoningParts.push(
    'יישום: יש לבחון כיצד העובדות נופלות לגדר הנורמה ולהשוותן לתקדימים. בהיעדר עובדות מספיקות — יש להשלים ראיות/טיעונים.'
  )

  return {
    id: uid('aij'),
    createdAt: new Date().toISOString(),
    issue: issue || 'שאלה משפטית כללית',
    reasoning: reasoningParts.join('\n'),
    statutes,
    precedents,
    holding:
      'המלצת שופט ה-AI: להכריע לאחר השלמת ראיות וטיעונים; בינתיים — ניתוח משפטי דידקטי בלבד.',
    confidence: precedents.length && statutes.length ? 'medium' : 'low',
    disclaimers: [
      'כלי לימודי; אינו מחליף ייעוץ משפטי.',
      'הניתוח מבוסס על חומר שהוזן לתיק בלבד.',
    ],
  }
}

/**
 * שופט AI: מנסה LLM בשרת; אם אין מפתח — ניתוח מקומי.
 */
export async function runAIJudgeAnalysis(
  legalCase: LegalCase,
  issue: string,
  accessToken?: string | null,
): Promise<AIJudgeAnalysis> {
  const remote = await fetchLlmJudgeAnalysis(
    {
      issue: issue || 'שאלה משפטית כללית',
      caseId: legalCase.id,
      legalCase: {
        title: legalCase.title,
        level: legalCase.level,
        track: legalCase.track,
        summary: legalCase.summary,
        facts: legalCase.facts,
        claims: legalCase.claims,
        defenses: legalCase.defenses,
        referenceStatutes: legalCase.referenceStatutes,
        referencePrecedents: legalCase.referencePrecedents,
      },
    },
    accessToken,
  )

  if (!remote) {
    return runAIJudgeAnalysisLocal(legalCase, issue)
  }

  const statutes: Statute[] = (remote.statutes || []).map((s) => ({
    id: uid('stat'),
    title: s.title,
    section: s.section,
    excerpt: s.excerpt,
    sourceUrl: s.sourceUrl,
  }))

  const precedents: Precedent[] = (remote.precedents || []).map((p) => ({
    id: uid('prec'),
    title: p.title,
    citation: p.citation,
    court: mapCourt(p.court),
    year: p.year,
    summary: p.summary,
    relevance: p.relevance,
    sourceUrl: p.sourceUrl,
  }))

  const disclaimers = [
    ...(remote.disclaimers || []),
    'כלי לימודי; אינו מחליף ייעוץ משפטי.',
    'יש לאמת מקורות מול מאגרים רשמיים (למשל נבו, אתר בתי המשפט) לפני הסתמכות במטלה אקדמית.',
  ]

  return {
    id: uid('aij'),
    createdAt: new Date().toISOString(),
    issue: remote.issue,
    reasoning: remote.reasoning,
    statutes,
    precedents,
    holding: remote.holding,
    confidence: remote.confidence || 'medium',
    disclaimers,
  }
}

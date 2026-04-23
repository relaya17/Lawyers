import type {
  CaseTrack,
  CourtLevel,
  JudgeMode,
  LegalCase,
  Precedent,
  Statute,
} from '../types'
import { fetchLlmGenerateCase } from './virtualCourtRemote'

export interface GenerateCaseInput {
  topic: string
  track: CaseTrack
  level: CourtLevel
  judgeMode: JudgeMode
  seed?: string
}

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const topicHints: Record<string, { precedents: Precedent[]; statutes: Statute[] }> = {
  'חוזים': {
    precedents: [
      {
        id: uid('prec'),
        title: 'ע״א 4628/93 מדינת ישראל נ׳ אפרופים',
        citation: 'ע״א 4628/93',
        court: 'supreme',
        year: 1995,
        summary: 'פרשנות חוזה — לשון ותכלית; הלכת אפרופים.',
        relevance: 'כלל פרשנות יסודי לכל מחלוקת חוזית.',
      },
    ],
    statutes: [
      {
        id: uid('stat'),
        title: 'חוק החוזים (חלק כללי), התשל״ג-1973',
        section: 'סעיפים 12, 25, 39',
        excerpt: 'תום לב במשא ומתן ובקיום; פרשנות חוזה; חובת תום לב כללית.',
      },
    ],
  },
  'נזיקין': {
    precedents: [
      {
        id: uid('prec'),
        title: 'ע״א 243/83 עיריית ירושלים נ׳ גורדון',
        citation: 'ע״א 243/83',
        court: 'supreme',
        year: 1985,
        summary: 'אחריות רשות ציבורית בנזיקין; עקרון הצדק המתקן.',
        relevance: 'בסיס לאחריות רשות ולשיקולי מדיניות.',
      },
    ],
    statutes: [
      {
        id: uid('stat'),
        title: 'פקודת הנזיקין [נוסח חדש]',
        section: 'סעיפים 35-36',
        excerpt: 'עוולת הרשלנות — חובת זהירות, הפרה, נזק וקשר סיבתי.',
      },
    ],
  },
  'פלילי': {
    precedents: [
      {
        id: uid('prec'),
        title: 'ע״פ 9657/08 פלוני נ׳ מדינת ישראל',
        citation: 'ע״פ 9657/08',
        court: 'supreme',
        summary: 'נטל ההוכחה מעבר לספק סביר; עקרון החוקיות.',
        relevance: 'מסגרת הכרעה פלילית.',
      },
    ],
    statutes: [
      {
        id: uid('stat'),
        title: 'חוק העונשין, התשל״ז-1977',
        section: 'סעיפים 19-20, 34כא',
        excerpt: 'יסוד נפשי, מודעות, הגנות כלליות.',
      },
    ],
  },
}

const inferHint = (topic: string) => {
  const key = Object.keys(topicHints).find((k) => topic.includes(k))
  return key ? topicHints[key] : { precedents: [], statutes: [] }
}

function emptyCaseShell(
  input: GenerateCaseInput,
  id: string,
  now: string,
  extra?: Partial<LegalCase>
): LegalCase {
  return {
    id,
    caseNumber: `מס׳ ${Math.floor(Math.random() * 90000 + 10000)}/26`,
    title: `תיק בנושא: ${input.topic}`,
    shortTitle: input.topic,
    topic: input.topic,
    track: input.track,
    level: input.level,
    status: 'draft',
    summary:
      'תיק שנוצר אוטומטית לצורכי לימוד. יש להשלים עובדות, צדדים וראיות לפני קיום דיון. הכלי להדגמה בלבד ואינו ייעוץ משפטי.',
    facts: [
      'להשלמה — נסיבות רלוונטיות, תאריכים, מסמכים.',
      'להשלמה — זהות הצדדים ותפקידיהם.',
    ],
    claims: ['להשלמה — עילות התביעה/העתירה.'],
    defenses: ['להשלמה — הגנות ותשובות לתביעה/לעתירה.'],
    judgeMode: input.judgeMode,
    source: 'ai_generated',
    createdAt: now,
    updatedAt: now,
    participants: [],
    hearings: [],
    protocol: [],
    evidence: [],
    documents: [],
    analyses: [],
    rulings: [],
    mediations: [],
    timeline: [
      {
        id: uid('tl'),
        at: now,
        type: 'case_opened',
        title: `תיק נוצר אוטומטית — ${input.topic}`,
      },
    ],
    referencePrecedents: [],
    referenceStatutes: [],
    ...extra,
  }
}

/** מחולל מקומי — כשאין LLM או כשהשרת מחזיר 503 */
export function generateCaseLocal(input: GenerateCaseInput): LegalCase {
  const hint = inferHint(input.topic)
  const id = uid('case')
  const now = new Date().toISOString()
  return emptyCaseShell(input, id, now, {
    referencePrecedents: hint.precedents,
    referenceStatutes: hint.statutes,
  })
}

function mapCourt(c?: string): Precedent['court'] {
  if (c === 'magistrate' || c === 'district' || c === 'supreme' || c === 'other') return c
  return 'supreme'
}

/**
 * יוצר תיק: מנסה LLM בשרת (OPENAI_API_KEY), ואם אין — נופל חזרה למחולל המקומי.
 */
export async function generateCaseByTopic(input: GenerateCaseInput): Promise<LegalCase> {
  const llm = await fetchLlmGenerateCase({
    topic: input.topic,
    track: input.track,
    level: input.level,
    judgeMode: input.judgeMode,
  })

  if (!llm) {
    return generateCaseLocal(input)
  }

  const id = uid('case')
  const now = new Date().toISOString()

  const referencePrecedents: Precedent[] = (llm.referencePrecedents || []).map((p) => ({
    id: uid('prec'),
    title: p.title,
    citation: p.citation,
    court: mapCourt(p.court),
    year: p.year,
    summary: p.summary,
    relevance: p.relevance,
    sourceUrl: p.sourceUrl,
  }))

  const referenceStatutes: Statute[] = (llm.referenceStatutes || []).map((s) => ({
    id: uid('stat'),
    title: s.title,
    section: s.section,
    excerpt: s.excerpt,
    sourceUrl: s.sourceUrl,
  }))

  return {
    ...emptyCaseShell(input, id, now),
    caseNumber: llm.caseNumber || `מס׳ ${Math.floor(Math.random() * 90000 + 10000)}/26`,
    title: llm.title,
    shortTitle: llm.shortTitle || input.topic,
    summary: llm.summary,
    facts: llm.facts?.length ? llm.facts : emptyCaseShell(input, id, now).facts,
    claims: llm.claims?.length ? llm.claims : emptyCaseShell(input, id, now).claims,
    defenses: llm.defenses?.length ? llm.defenses : emptyCaseShell(input, id, now).defenses,
    referencePrecedents,
    referenceStatutes,
    timeline: [
      {
        id: uid('tl'),
        at: now,
        type: 'case_opened',
        title: `תיק נוצר באמצעות LLM — ${input.topic}`,
      },
    ],
    source: 'ai_generated',
  }
}

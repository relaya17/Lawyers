import { currentApiConfig } from '@/app/config/apiConfig'

const base = () => currentApiConfig.baseURL.replace(/\/$/, '')

export interface LlmGenerateCaseResponse {
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
    court?: 'magistrate' | 'district' | 'supreme' | 'other'
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
}

export interface LlmJudgeAnalysisResponse {
  issue: string
  reasoning: string
  holding: string
  confidence: 'low' | 'medium' | 'high'
  statutes: LlmGenerateCaseResponse['referenceStatutes']
  precedents: LlmGenerateCaseResponse['referencePrecedents']
  disclaimers: string[]
}

export async function fetchLlmGenerateCase(body: {
  topic: string
  track: string
  level: string
  judgeMode: string
}): Promise<LlmGenerateCaseResponse | null> {
  try {
    const r = await fetch(`${base()}/ai/virtual-court/generate-case`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    })
    if (r.status === 503) return null
    if (!r.ok) return null
    return (await r.json()) as LlmGenerateCaseResponse
  } catch {
    return null
  }
}

export async function fetchLlmJudgeAnalysis(body: {
  issue: string
  legalCase: {
    title: string
    level: string
    track: string
    summary: string
    facts: string[]
    claims: string[]
    defenses: string[]
    referenceStatutes: unknown[]
    referencePrecedents: unknown[]
  }
}): Promise<LlmJudgeAnalysisResponse | null> {
  try {
    const r = await fetch(`${base()}/ai/virtual-court/judge-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    })
    if (r.status === 503) return null
    if (!r.ok) return null
    return (await r.json()) as LlmJudgeAnalysisResponse
  } catch {
    return null
  }
}

export async function pushCaseSnapshot(caseId: string, payload: unknown): Promise<boolean> {
  try {
    const r = await fetch(`${base()}/virtual-court-2/cases/${encodeURIComponent(caseId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ payload }),
    })
    return r.ok
  } catch {
    return false
  }
}

export async function pullCaseSnapshot(caseId: string): Promise<unknown | null> {
  try {
    const r = await fetch(`${base()}/virtual-court-2/cases/${encodeURIComponent(caseId)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })
    if (r.status === 404 || r.status === 503) return null
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

export type RealCaseImportApiResponse = LlmGenerateCaseResponse & {
  sourceDescription: string
  anonymizationNote: string
  provenanceUrls?: string[]
}

async function postImport(
  path: string,
  body: Record<string, unknown>
): Promise<RealCaseImportApiResponse | null> {
  const r = await fetch(`${base()}/virtual-court-2${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  if (r.status === 503) return null
  if (!r.ok) {
    let msg = `HTTP ${r.status}`
    try {
      const err = (await r.json()) as { error?: string }
      if (err.error) msg = err.error
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  return (await r.json()) as RealCaseImportApiResponse
}

export async function importRealCaseFromText(body: {
  text: string
  category?: string
  courtLevel?: string
  caseTrack?: string
}): Promise<RealCaseImportApiResponse | null> {
  return postImport('/import/from-text', body as Record<string, unknown>)
}

export async function importRealCaseFromUrl(body: {
  url: string
  category?: string
  courtLevel?: string
  caseTrack?: string
}): Promise<RealCaseImportApiResponse | null> {
  return postImport('/import/from-url', body as Record<string, unknown>)
}

export async function importRealCaseFromCategory(body: {
  category: string
  courtLevel?: string
  caseTrack?: string
}): Promise<RealCaseImportApiResponse | null> {
  return postImport('/import/from-category', body as Record<string, unknown>)
}

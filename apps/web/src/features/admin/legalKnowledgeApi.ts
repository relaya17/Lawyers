import { authJsonWithBearer } from '@/features/auth/api/authHttp'

export interface LegalKbStats {
  ready: boolean
  total: number
  verified: number
  withEmbedding: number
  draft: number
  error?: string
}

export interface KbDocumentRow {
  id: string
  title: string | null
  content: string
  source_url: string | null
  category: string | null
  verification_status: string
}

export interface RagCitation {
  id: string
  title: string | null
  excerpt: string
  sourceUrl: string | null
  category: string | null
  verificationStatus: string
  similarity: number
}

export async function fetchLegalKbStats(accessToken: string): Promise<LegalKbStats> {
  try {
    return await authJsonWithBearer<LegalKbStats>('/admin/legal-knowledge/stats', accessToken)
  } catch {
    return { ready: false, total: 0, verified: 0, withEmbedding: 0, draft: 0, error: 'unavailable' }
  }
}

export async function adminVectorSearch(
  accessToken: string,
  body: { query: string; matchThreshold?: number; matchCount?: number; verifiedOnly?: boolean },
): Promise<RagCitation[]> {
  return authJsonWithBearer<RagCitation[]>('/admin/legal-knowledge/vector-search', accessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function listKbDocuments(
  accessToken: string,
  params: { search?: string; status?: 'all' | 'draft' | 'verified'; limit?: number; offset?: number },
): Promise<{ rows: KbDocumentRow[]; total: number }> {
  const sp = new URLSearchParams()
  if (params.search) sp.set('search', params.search)
  if (params.status) sp.set('status', params.status)
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.offset != null) sp.set('offset', String(params.offset))
  const q = sp.toString()
  return authJsonWithBearer<{ rows: KbDocumentRow[]; total: number }>(
    `/admin/legal-knowledge/documents${q ? `?${q}` : ''}`,
    accessToken,
  )
}

export async function patchDocumentVerification(
  accessToken: string,
  id: string,
  verificationStatus: 'draft' | 'verified',
): Promise<void> {
  await authJsonWithBearer(`/admin/legal-knowledge/documents/${encodeURIComponent(id)}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ verificationStatus }),
  })
}

export async function createKbDocument(
  accessToken: string,
  body: {
    title?: string
    content: string
    sourceUrl?: string | null
    category?: string | null
    verificationStatus?: 'draft' | 'verified'
    computeEmbedding?: boolean
  },
): Promise<{ id: string }> {
  return authJsonWithBearer<{ id: string }>('/admin/legal-knowledge/documents', accessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function legalRagQuery(
  accessToken: string,
  query: string,
  options?: { matchThreshold?: number; verifiedOnly?: boolean },
): Promise<{ answer: string; citations: RagCitation[]; usedVerifiedOnly: boolean }> {
  return authJsonWithBearer('/legal/rag/query', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      query,
      matchThreshold: options?.matchThreshold ?? 0.45,
      matchCount: 4,
      verifiedOnly: options?.verifiedOnly ?? false,
    }),
  })
}

/**
 * קריאות ל-API Auth עם credentials + CSRF (עוגיית lex_csrf).
 * Access JWT לא נשמר ב-localStorage — רק בזיכרון (Context/Redux).
 */

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(
  /\/$/,
  '',
)

let csrfToken: string | null = null

export function getApiRoot(): string {
  return API_ROOT
}

export async function prefetchCsrf(): Promise<string> {
  const r = await fetch(`${API_ROOT}/auth/csrf`, { credentials: 'include' })
  if (!r.ok) throw new Error('אתחול אבטחה (CSRF) נכשל')
  const j = (await r.json()) as { csrfToken: string }
  csrfToken = j.csrfToken
  return csrfToken
}

async function ensureCsrf(): Promise<string> {
  if (csrfToken) return csrfToken
  return prefetchCsrf()
}

export function clearCsrfCache(): void {
  csrfToken = null
}

export async function authJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase()
  const headers = new Headers(init.headers)
  if (method !== 'GET' && method !== 'HEAD') {
    const t = await ensureCsrf()
    headers.set('X-CSRF-Token', t)
  }
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }
  const r = await fetch(`${API_ROOT}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })
  if (!r.ok) {
    const j = (await r.json().catch(() => ({}))) as {
      error?: string
      details?: unknown
    }
    const err = new Error(j.error || `HTTP ${r.status}`) as Error & {
      status?: number
      details?: unknown
    }
    err.status = r.status
    err.details = j.details
    throw err
  }
  if (r.status === 204) return undefined as T
  const ct = r.headers.get('content-type')
  if (!ct?.includes('application/json')) return undefined as T
  return (await r.json()) as T
}

export async function authJsonWithBearer<T>(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method || 'GET').toUpperCase()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)
  if (method !== 'GET' && method !== 'HEAD') {
    const t = await ensureCsrf()
    headers.set('X-CSRF-Token', t)
  }
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }
  const r = await fetch(`${API_ROOT}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })
  if (!r.ok) {
    const j = (await r.json().catch(() => ({}))) as { error?: string }
    const err = new Error(j.error || `HTTP ${r.status}`) as Error & { status?: number }
    err.status = r.status
    throw err
  }
  if (r.status === 204) return undefined as T
  return (await r.json()) as T
}

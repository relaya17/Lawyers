/**
 * יצירת embeddings דרך OpenAI — לשימוש RAG (text-embedding-3-small, 1536 מימדים).
 */
import { withJsonCache } from './aiResponseCache.js';

const MAX_INPUT_CHARS = 8000;

export function isEmbeddingsConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function createEmbedding(input: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY;
  const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

  if (!key?.trim()) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const trimmed = input.slice(0, MAX_INPUT_CHARS);

  const { value } = await withJsonCache<number[]>(
    {
      scope: 'embedding',
      payload: { model, input: trimmed },
      ttlDays: 180,
      model,
    },
    () => callEmbeddingsApi(base, key, model, trimmed),
  );
  return value;
}

async function callEmbeddingsApi(
  base: string,
  key: string,
  model: string,
  trimmed: string,
): Promise<number[]> {
  const maxAttempts = 5;
  let attempt = 0;
  let lastErr: Error | null = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    const res = await fetch(`${base}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model, input: trimmed }),
    });

    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10);
      const backoffMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 500 * 2 ** attempt);
      await sleep(backoffMs);
      lastErr = new Error(`Embeddings rate limited (429), attempt ${attempt}`);
      continue;
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Embeddings HTTP ${res.status}: ${errText.slice(0, 400)}`);
    }

    const data = (await res.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    const emb = data.data?.[0]?.embedding;
    if (!emb?.length) {
      throw new Error('Empty embedding response');
    }
    return emb;
  }

  throw lastErr ?? new Error('Embeddings failed after retries');
}

/**
 * מספר טקסטים בבקשת embedding אחת (חיסכון בקריאות) + השהיה בין אצ'ים כדי להימנע מ-429.
 * OpenAI תומך ב-input כמערך מחרוזות; כאן מפצלים ל־batchSize קטן לפי המלצת התפעול.
 */
export async function createEmbeddingsBatched(
  inputs: string[],
  opts?: { batchSize?: number; pauseMsBetweenBatches?: number },
): Promise<number[][]> {
  const batchSize = Math.max(1, Math.min(opts?.batchSize ?? 12, 64));
  const pauseMs = opts?.pauseMsBetweenBatches ?? 400;
  const key = process.env.OPENAI_API_KEY;
  const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

  if (!key?.trim()) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const out: number[][] = [];
  for (let i = 0; i < inputs.length; i += batchSize) {
    const chunk = inputs.slice(i, i + batchSize).map((s) => s.slice(0, MAX_INPUT_CHARS));
    let attempt = 0;
    const maxAttempts = 5;
    let batchDone = false;
    while (attempt < maxAttempts && !batchDone) {
      attempt += 1;
      const res = await fetch(`${base}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ model, input: chunk }),
      });

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10);
        await sleep(retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 500 * 2 ** attempt));
        continue;
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Embeddings batch HTTP ${res.status}: ${errText.slice(0, 400)}`);
      }

      const data = (await res.json()) as { data?: Array<{ index?: number; embedding?: number[] }> };
      const rows = data.data ?? [];
      rows.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      for (const row of rows) {
        const emb = row.embedding;
        if (!emb?.length) throw new Error('Empty embedding in batch response');
        out.push(emb);
      }
      batchDone = true;
    }
    if (!batchDone) {
      throw new Error('Embeddings batch failed after retries (rate limit)');
    }

    if (i + batchSize < inputs.length && pauseMs > 0) {
      await sleep(pauseMs);
    }
  }

  if (out.length !== inputs.length) {
    throw new Error(`Embedding count mismatch: got ${out.length}, expected ${inputs.length}`);
  }
  return out;
}

/** פורמט ליטרל ל-cast ל-vector ב-PostgreSQL */
export function embeddingToPgVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

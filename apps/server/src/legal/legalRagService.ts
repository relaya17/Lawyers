import { createEmbedding, isEmbeddingsConfigured } from '../services/openaiEmbeddings.js';
import { isLlmConfigured } from '../services/virtualCourtOpenAI.js';
import { matchLegalDocuments, type LegalKbRow } from './ragRepo.js';
import { withJsonCache } from '../services/aiResponseCache.js';

const RAG_SYSTEM = `אתה עוזר משפטי לסטודנטים לדין בישראל (רמת אוניברסיטה).
כללים קריטיים:
- הסתמך אך ורק על קטעי המקורות שסופקו בבלוק "מקורות מהמאגר". אם אין מקורות או שהם אינם רלוונטיים — אמור במפורש שאין לך בסיס במאגר לענות, ואל תמציא סעיפי חוק או פסיקה.
- צטט או ציין את שם/קטגורית המקור כשאתה מתייחס לתוכן.
- זה אינו ייעוץ משפטי; הדגש חינוך והבנה.
- ענה בעברית משפטית ברורה.`;

export interface RagCitation {
  id: string;
  title: string | null;
  excerpt: string;
  sourceUrl: string | null;
  category: string | null;
  verificationStatus: string;
  similarity: number;
}

export interface RagQueryResult {
  answer: string;
  citations: RagCitation[];
  usedVerifiedOnly: boolean;
}

export interface RagSearchOnlyResult {
  citations: RagCitation[];
}

function rowsToCitations(rows: LegalKbRow[]): RagCitation[] {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: r.content.length > 1200 ? `${r.content.slice(0, 1200)}…` : r.content,
    sourceUrl: r.source_url,
    category: r.category,
    verificationStatus: r.verification_status,
    similarity: r.similarity,
  }));
}

export async function searchLegalKnowledge(params: {
  query: string;
  matchThreshold: number;
  matchCount: number;
  verifiedOnly: boolean;
}): Promise<RagSearchOnlyResult> {
  if (!isEmbeddingsConfigured()) {
    throw new Error('Embeddings not configured (OPENAI_API_KEY)');
  }
  const embedding = await createEmbedding(params.query);
  const rows = await matchLegalDocuments({
    queryEmbedding: embedding,
    matchThreshold: params.matchThreshold,
    matchCount: params.matchCount,
    verifiedOnly: params.verifiedOnly,
  });
  return { citations: rowsToCitations(rows) };
}

async function completeOpenAIText(system: string, user: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!key?.trim()) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`LLM HTTP ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('Empty LLM response');
  }
  return text;
}

export async function answerWithRag(params: {
  query: string;
  matchThreshold: number;
  matchCount: number;
  verifiedOnly: boolean;
}): Promise<RagQueryResult> {
  if (!isEmbeddingsConfigured() || !isLlmConfigured()) {
    throw new Error('OPENAI_API_KEY required for RAG (embeddings + chat)');
  }

  const embedding = await createEmbedding(params.query);
  const rows = await matchLegalDocuments({
    queryEmbedding: embedding,
    matchThreshold: params.matchThreshold,
    matchCount: params.matchCount,
    verifiedOnly: params.verifiedOnly,
  });
  const citations = rowsToCitations(rows);

  if (rows.length === 0) {
    return {
      answer:
        'לא נמצאו קטעים רלוונטיים במאגר הידע המשפטי (או שהסף לדמיון נמוך מדי). ' +
        'מומלץ להרחיב את המאגר או להוריד את רף הדמיון בבדיקה. לא אוכל לנסח תשובה מבוססת מקורות בלי שליפה.',
      citations: [],
      usedVerifiedOnly: params.verifiedOnly,
    };
  }

  const cap = (t: string, max: number) => (t.length <= max ? t : `${t.slice(0, max)}…`);
  const sourcesBlock = rows
    .map(
      (r, i) =>
        `--- מקור ${i + 1} (מזהה: ${r.id}, קטגוריה: ${r.category ?? 'לא צוין'}, אימות: ${r.verification_status}, דמיון: ${(r.similarity * 100).toFixed(1)}%)\n` +
        `${r.title ? `כותרת: ${r.title}\n` : ''}${cap(r.content, 6000)}\n` +
        (r.source_url ? `קישור: ${r.source_url}\n` : ''),
    )
    .join('\n');

  const userMsg = `מקורות מהמאגר (השתמש רק בהם):\n${sourcesBlock}\n\nשאלת המשתמש:\n${params.query}`;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const { value: answer } = await withJsonCache<string>(
    {
      scope: 'rag_answer',
      payload: {
        model,
        system: RAG_SYSTEM,
        query: params.query,
        sourceIds: rows.map((r) => r.id).sort(),
        verifiedOnly: params.verifiedOnly,
      },
      ttlDays: 45,
      model,
    },
    () => completeOpenAIText(RAG_SYSTEM, userMsg),
  );

  return {
    answer,
    citations,
    usedVerifiedOnly: params.verifiedOnly,
  };
}

/** הקשר טקסטואלי מקוצר להזרקה ל-prompt אחר (למשל שופט AI) */
export async function retrieveContextForPrompt(params: {
  query: string;
  matchThreshold: number;
  matchCount: number;
  verifiedOnly: boolean;
}): Promise<string | null> {
  try {
    if (!isEmbeddingsConfigured()) return null;
    const { citations } = await searchLegalKnowledge(params);
    if (citations.length === 0) return null;
    return citations
      .map(
        (c, i) =>
          `[${i + 1}] ${c.title ? `${c.title}: ` : ''}${c.excerpt.slice(0, 600)}${c.excerpt.length > 600 ? '…' : ''}`,
      )
      .join('\n\n');
  } catch {
    return null;
  }
}

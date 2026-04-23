import type { Pool } from 'pg';
import { getAuthPool } from '../db/pgPool.js';
import { embeddingToPgVectorLiteral } from '../services/openaiEmbeddings.js';

export interface LegalKbRow {
  id: string;
  title: string | null;
  content: string;
  source_url: string | null;
  category: string | null;
  verification_status: string;
  similarity: number;
}

export interface LegalKbStats {
  total: number;
  verified: number;
  withEmbedding: number;
  draft: number;
}

function pool(): Pool {
  return getAuthPool();
}

export async function matchLegalDocuments(params: {
  queryEmbedding: number[];
  matchThreshold: number;
  matchCount: number;
  verifiedOnly: boolean;
}): Promise<LegalKbRow[]> {
  const vec = embeddingToPgVectorLiteral(params.queryEmbedding);
  const r = await pool().query<LegalKbRow>(
    `SELECT id, title, content, source_url, category, verification_status, similarity
     FROM match_legal_documents($1::vector, $2, $3, $4)`,
    [vec, params.matchThreshold, params.matchCount, params.verifiedOnly],
  );
  return r.rows;
}

export async function getLegalKnowledgeStats(): Promise<LegalKbStats> {
  const r = await pool().query<{
    total: string;
    verified: string;
    with_embedding: string;
    draft: string;
  }>(
    `SELECT
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE verification_status = 'verified')::text AS verified,
       COUNT(*) FILTER (WHERE embedding IS NOT NULL)::text AS with_embedding,
       COUNT(*) FILTER (WHERE verification_status = 'draft')::text AS draft
     FROM legal_knowledge_base`,
  );
  const row = r.rows[0];
  return {
    total: parseInt(row?.total ?? '0', 10),
    verified: parseInt(row?.verified ?? '0', 10),
    withEmbedding: parseInt(row?.with_embedding ?? '0', 10),
    draft: parseInt(row?.draft ?? '0', 10),
  };
}

export interface ListKbParams {
  search?: string;
  verificationStatus?: 'draft' | 'verified' | 'all';
  limit: number;
  offset: number;
}

export async function listLegalKnowledgeDocuments(
  params: ListKbParams,
): Promise<{ rows: LegalKbRow[]; total: number }> {
  const conditions: string[] = ['1=1'];
  const values: unknown[] = [];
  let i = 1;

  if (params.search?.trim()) {
    conditions.push(`(content ILIKE $${i} OR COALESCE(title, '') ILIKE $${i} OR COALESCE(category, '') ILIKE $${i})`);
    values.push(`%${params.search.trim()}%`);
    i += 1;
  }

  if (params.verificationStatus && params.verificationStatus !== 'all') {
    conditions.push(`verification_status = $${i}`);
    values.push(params.verificationStatus);
    i += 1;
  }

  const whereSql = conditions.join(' AND ');

  const countR = await pool().query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM legal_knowledge_base WHERE ${whereSql}`,
    values,
  );
  const total = parseInt(countR.rows[0]?.c ?? '0', 10);

  values.push(params.limit, params.offset);
  const limIdx = i;
  const offIdx = i + 1;

  const dataR = await pool().query<{
    id: string;
    title: string | null;
    content: string;
    source_url: string | null;
    category: string | null;
    verification_status: string;
  }>(
    `SELECT id, title, content, source_url, category, verification_status
     FROM legal_knowledge_base
     WHERE ${whereSql}
     ORDER BY updated_at DESC
     LIMIT $${limIdx} OFFSET $${offIdx}`,
    values,
  );

  const rows: LegalKbRow[] = dataR.rows.map((row) => ({
    ...row,
    similarity: 0,
  }));

  return { rows, total };
}

export async function updateVerificationStatus(
  id: string,
  status: 'draft' | 'verified',
): Promise<boolean> {
  const r = await pool().query(
    `UPDATE legal_knowledge_base
     SET verification_status = $2, updated_at = now()
     WHERE id = $1`,
    [id, status],
  );
  return (r.rowCount ?? 0) > 0;
}

export async function insertLegalDocument(params: {
  title?: string | null;
  content: string;
  sourceUrl?: string | null;
  category?: string | null;
  verificationStatus: 'draft' | 'verified';
  embedding: number[] | null;
}): Promise<string> {
  if (params.embedding?.length) {
    const vec = embeddingToPgVectorLiteral(params.embedding);
    const r = await pool().query<{ id: string }>(
      `INSERT INTO legal_knowledge_base
        (title, content, source_url, category, verification_status, embedding)
       VALUES ($1, $2, $3, $4, $5, $6::vector)
       RETURNING id`,
      [
        params.title ?? null,
        params.content,
        params.sourceUrl ?? null,
        params.category ?? null,
        params.verificationStatus,
        vec,
      ],
    );
    const id = r.rows[0]?.id;
    if (!id) throw new Error('insert failed');
    return id;
  }

  const r = await pool().query<{ id: string }>(
    `INSERT INTO legal_knowledge_base
      (title, content, source_url, category, verification_status, embedding)
     VALUES ($1, $2, $3, $4, $5, NULL)
     RETURNING id`,
    [
      params.title ?? null,
      params.content,
      params.sourceUrl ?? null,
      params.category ?? null,
      params.verificationStatus,
    ],
  );
  const id = r.rows[0]?.id;
  if (!id) throw new Error('insert failed');
  return id;
}

/** בדיקת זמינות טבלה (ללא pgvector ב-DB ישיר) */
export async function isLegalKbTableReady(): Promise<boolean> {
  try {
    const r = await pool().query(`SELECT 1 FROM legal_knowledge_base LIMIT 1`);
    return r.rows.length >= 0;
  } catch {
    return false;
  }
}

-- מאגר ידע משפטי ל-RAG (pgvector). הרצה: psql "$DATABASE_URL" -f sql/legal/001_legal_knowledge_base.sql
-- ב-Supabase: Database → Extensions → הפעל "vector", ואז הרץ קובץ זה.
--
-- אימות שההרחבה פעילה (אחרי הרצת SQL או אחרי הפעלה ב-Dashboard):
--   SELECT * FROM pg_extension WHERE extname = 'vector';
-- צפי שורה אחת עם extname = vector.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS legal_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  source_url TEXT,
  category TEXT,
  verification_status TEXT NOT NULL DEFAULT 'draft',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT legal_knowledge_base_verification_chk
    CHECK (verification_status IN ('draft', 'verified'))
);

CREATE INDEX IF NOT EXISTS idx_legal_kb_category ON legal_knowledge_base (category);
CREATE INDEX IF NOT EXISTS idx_legal_kb_status ON legal_knowledge_base (verification_status);

COMMENT ON TABLE legal_knowledge_base IS 'LexStudy RAG: סעיפי חוק / קטעי פסיקה עם embedding (text-embedding-3-small = 1536)';

-- שליפה לפי דמיון קוסינוס (pgvector: <=> = cosine distance)
CREATE OR REPLACE FUNCTION match_legal_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_verified_only boolean DEFAULT false
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  source_url text,
  category text,
  verification_status text,
  similarity double precision
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    k.id,
    k.title,
    k.content,
    k.source_url,
    k.category,
    k.verification_status,
    (1 - (k.embedding <=> query_embedding))::double precision AS similarity
  FROM legal_knowledge_base k
  WHERE k.embedding IS NOT NULL
    AND (1 - (k.embedding <=> query_embedding)) >= match_threshold
    AND (NOT filter_verified_only OR k.verification_status = 'verified')
  ORDER BY k.embedding <=> query_embedding
  LIMIT GREATEST(1, LEAST(match_count, 50));
$$;

/**
 * דוגמת הזנה למאגר RAG (הרצה חד-פעמית לאחר יצירת הטבלה).
 * שימוש: cd apps/server && pnpm exec tsx scripts/ingest-legal-sample.ts
 *
 * דורש: DATABASE_URL, OPENAI_API_KEY, וטבלת legal_knowledge_base (sql/legal/001_legal_knowledge_base.sql)
 *
 * מניעת 429: השהיה בין מסמכים (משתנה סביבה INGEST_DELAY_MS, ברירת מחדל 350ms).
 * לנפח גדול: השתמשי ב-createEmbeddingsBatched בקוד ייעודי.
 */
import 'dotenv/config';
import pg from 'pg';
import { createEmbedding, embeddingToPgVectorLiteral } from '../src/services/openaiEmbeddings.js';

const delayMs = Math.max(0, parseInt(process.env.INGEST_DELAY_MS || '350', 10));

async function pause(): Promise<void> {
  if (delayMs <= 0) return;
  await new Promise((r) => setTimeout(r, delayMs));
}

const samples: Array<{
  title: string;
  content: string;
  sourceUrl: string | null;
  category: string;
}> = [
  {
    title: 'חוק החוזים (הסכמים) — תקנת הציבור',
    category: 'אזרחי',
    sourceUrl: 'https://www.nevo.co.il/',
    content:
      'סעיף 1 לחוק החוזים (הסכמים), התשל"ג-1973 קובע כי בכפוף להוראות חוק זה, יש לקיים הסכם כפי שהוסכם עליו. ' +
      'סעיף 12 לחוק החוזים קובע כי תניה המקנה לצד לחוזה שלילה או הגבלה של זכויות הנתונה לו לפי דין, בין בהסכם ובין שלא בהסכם, ' +
      'בתנאים שאינם סבירים, אין תוקף. זוהי תקנת הציבור המרכזית בחוזים אחידים וביחסים בין צרכן לספק.',
  },
  {
    title: 'חוק העונשין — עבירות כלפי רכוש (דוגמה חינוכית)',
    category: 'פלילי',
    sourceUrl: null,
    content:
      'במסגרת לימוד עקרונות יסוד: עבירות כלפי רכוש מוסדרות בחלק ח׳ לחוק העונשין. גניבה מוגדרת כלקיחת נכס המוחזק בידי אחר שלא למטרת רווח זמני, ' +
      'בכוונה לשלולו מבעליו. יש להסתמך תמיד על נוסח מעודכן ועל פסיקה עדכנית — הקטע להמחשה בלבד.',
  },
];

async function main(): Promise<void> {
  const conn = process.env.DATABASE_URL?.trim();
  if (!conn) {
    console.error('חסר DATABASE_URL');
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: conn,
    ssl: conn.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  });

  try {
    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const emb = await createEmbedding(`${s.title}\n\n${s.content}`);
      const vec = embeddingToPgVectorLiteral(emb);
      await pool.query(
        `INSERT INTO legal_knowledge_base
          (title, content, source_url, category, verification_status, embedding)
         VALUES ($1, $2, $3, $4, 'verified', $5::vector)`,
        [s.title, s.content, s.sourceUrl, s.category, vec],
      );
      console.log('נוסף:', s.title);
      if (i < samples.length - 1) await pause();
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

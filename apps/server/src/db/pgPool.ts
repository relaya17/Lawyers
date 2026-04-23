import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getAuthPool(): pg.Pool {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is not set (Supabase PostgreSQL connection string)');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      ssl:
        process.env.DATABASE_SSL === 'true' || process.env.DATABASE_URL.includes('supabase')
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return pool;
}

export async function authDbHealth(): Promise<boolean> {
  try {
    const p = getAuthPool();
    const r = await p.query('SELECT 1 as ok');
    return r.rows[0]?.ok === 1;
  } catch {
    return false;
  }
}

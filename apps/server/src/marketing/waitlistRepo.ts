import { getAuthPool } from '../db/pgPool.js';

export async function addWaitlistEmail(email: string, source: string): Promise<'inserted' | 'exists'> {
  const normalized = email.trim().toLowerCase();
  const r = await getAuthPool().query<{ id: string }>(
    `INSERT INTO marketing_waitlist (email, source)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [normalized, source],
  );
  if (r.rows[0]?.id) return 'inserted';
  return 'exists';
}

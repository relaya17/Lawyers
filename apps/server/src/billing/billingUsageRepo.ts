import { getAuthPool } from '../db/pgPool.js';

/** תאריך מקומי YYYY-MM-DD (ישראל) */
export function todayJerusalem(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
}

export async function getDailyQuestionCount(userId: string, date: string): Promise<number> {
  const r = await getAuthPool().query<{ count: string }>(
    `SELECT count::text FROM user_daily_question_usage WHERE user_id = $1 AND usage_date = $2`,
    [userId, date],
  );
  return parseInt(r.rows[0]?.count ?? '0', 10);
}

/** מגדיל מונה ב-1 ומחזיר את הספירה החדשה. */
export async function incrementDailyQuestionCount(userId: string, date: string): Promise<number> {
  const r = await getAuthPool().query<{ count: string }>(
    `INSERT INTO user_daily_question_usage (user_id, usage_date, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, usage_date)
     DO UPDATE SET count = user_daily_question_usage.count + 1
     RETURNING count::text`,
    [userId, date],
  );
  return parseInt(r.rows[0]?.count ?? '1', 10);
}

export async function getDailyAiCount(userId: string, date: string): Promise<number> {
  const r = await getAuthPool().query<{ count: string }>(
    `SELECT count::text FROM user_daily_ai_usage WHERE user_id = $1 AND usage_date = $2`,
    [userId, date],
  );
  return parseInt(r.rows[0]?.count ?? '0', 10);
}

export async function incrementDailyAiCount(userId: string, date: string): Promise<number> {
  const r = await getAuthPool().query<{ count: string }>(
    `INSERT INTO user_daily_ai_usage (user_id, usage_date, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, usage_date)
     DO UPDATE SET count = user_daily_ai_usage.count + 1
     RETURNING count::text`,
    [userId, date],
  );
  return parseInt(r.rows[0]?.count ?? '1', 10);
}

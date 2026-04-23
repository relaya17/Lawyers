/**
 * שירותי AI לחדר דיונים:
 *  - Whisper STT (תמלול אודיו מהמיקרופון)
 *  - הצעת שורת פרוטוקול (AI מזכירה — מבוסס על ההקשר האחרון)
 */

import { extractJsonObject } from '../lib/extractJson.js';
import { completeOpenAIJson } from '../services/virtualCourtOpenAI.js';

const OPENAI_BASE = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(
  /\/$/,
  '',
);
const WHISPER_MODEL = process.env.OPENAI_WHISPER_MODEL || 'whisper-1';

export interface TranscriptionResult {
  text: string;
  language?: string;
  durationSec?: number;
}

/**
 * מקבל buffer של אודיו (webm/mp3/wav/m4a) ומחזיר טקסט מתומלל.
 */
export async function transcribeAudio(
  buffer: Buffer,
  filename: string,
  languageHint: string = 'he',
): Promise<TranscriptionResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const form = new FormData();
  const mime = inferMime(filename);
  form.append('file', new Blob([new Uint8Array(buffer)], { type: mime }), filename);
  form.append('model', WHISPER_MODEL);
  if (languageHint) form.append('language', languageHint);
  form.append('response_format', 'verbose_json');

  const res = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Whisper HTTP ${res.status}: ${errText.slice(0, 500)}`);
  }
  const data = (await res.json()) as {
    text?: string;
    language?: string;
    duration?: number;
  };

  return {
    text: (data.text ?? '').trim(),
    language: data.language,
    durationSec: data.duration,
  };
}

function inferMime(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'webm':
      return 'audio/webm';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'm4a':
      return 'audio/mp4';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'audio/webm';
  }
}

// ---------- AI Clerk suggest ----------

const AI_CLERK_SYSTEM = `אתה "מזכיר AI" בסימולציית בית משפט בישראל. תפקידך לנסח את שורת הפרוטוקול הבאה — קצרה, מדויקת, בעברית משפטית רשמית.
חוקים:
- החזר JSON תקין בלבד לפי הסכמה בבקשת המשתמש.
- אל תמציא עובדות שלא הופיעו בהקשר.
- שמור על הסגנון הרשמי של בתי המשפט בישראל; השתמש בתפקידים (כב׳ השופט, עו״ד, התובע, ההגנה, העד).
- אין לתת ייעוץ משפטי — זהו תרגיל לימודי בלבד.`;

export interface AiClerkSuggestion {
  speakerRole: string;
  speakerName: string;
  text: string;
  entryType: 'statement' | 'question' | 'objection' | 'ruling' | 'evidence' | 'note' | 'system';
}

export async function suggestNextProtocolLine(input: {
  caseTitle: string;
  courtLevel: string;
  caseTrack: string;
  recentLines: Array<{ speakerName: string; speakerRole: string; text: string }>;
}): Promise<AiClerkSuggestion> {
  const payload = {
    task: 'suggest_next_protocol_line',
    context: input,
    schema: {
      speakerRole:
        'judge | prosecutor | defense_lawyer | plaintiff_lawyer | witness | expert | clerk | observer',
      speakerName: 'string — שם רשמי בעברית (למשל: כב׳ השופט כהן / עו״ד לוי / העד פלוני)',
      text: 'string — שורת פרוטוקול אחת, עד 2 משפטים',
      entryType: 'statement | question | objection | ruling | evidence | note | system',
    },
  };

  const raw = await completeOpenAIJson(AI_CLERK_SYSTEM, JSON.stringify(payload, null, 2));
  const obj = extractJsonObject(JSON.stringify(raw)) as Partial<AiClerkSuggestion>;

  return {
    speakerRole: obj.speakerRole ?? 'clerk',
    speakerName: obj.speakerName ?? 'המזכיר',
    text: obj.text ?? '',
    entryType: (obj.entryType as AiClerkSuggestion['entryType']) ?? 'statement',
  };
}

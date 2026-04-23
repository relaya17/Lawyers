import mongoose, { Schema, type Model } from 'mongoose';

/**
 * קאש שימוש חוזר לתשובות OpenAI כדי לחסוך עלויות.
 * key = sha256(scope + JSON.stringify(payload-normalized)).
 * TTL אוטומטי דרך `expiresAt` (שדה עם index TTL).
 */
export interface AiResponseCacheDoc {
  key: string;
  scope: string; // 'vc_generate_case' | 'vc_judge_analysis' | 'rag_answer' | 'embedding'
  model: string | null;
  response: unknown;
  hitCount: number;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date | null;
}

const AiResponseCacheSchema = new Schema<AiResponseCacheDoc>(
  {
    key: { type: String, required: true, unique: true, index: true },
    scope: { type: String, required: true, index: true },
    model: { type: String, default: null },
    response: { type: Schema.Types.Mixed, required: true },
    hitCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    lastAccessedAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date, default: null, index: { expireAfterSeconds: 0 } },
  },
  { collection: 'ai_response_cache', versionKey: false },
);

export const AiResponseCacheModel: Model<AiResponseCacheDoc> =
  (mongoose.models.AiResponseCache as Model<AiResponseCacheDoc> | undefined) ??
  mongoose.model<AiResponseCacheDoc>('AiResponseCache', AiResponseCacheSchema);

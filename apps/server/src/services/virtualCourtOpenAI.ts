import { z } from 'zod';
import { extractJsonObject } from '../lib/extractJson.js';
import { retrieveContextForPrompt } from '../legal/legalRagService.js';
import { withJsonCache } from './aiResponseCache.js';

const CourtLevelSchema = z.enum(['magistrate', 'district', 'supreme', 'other']);
const ConfidenceSchema = z.enum(['low', 'medium', 'high']);

const PrecedentSchema = z.object({
  title: z.string(),
  citation: z.string(),
  court: CourtLevelSchema.optional(),
  year: z.number().optional(),
  summary: z.string(),
  relevance: z.string(),
  sourceUrl: z.string().optional(),
});

const StatuteSchema = z.object({
  title: z.string(),
  section: z.string().optional(),
  excerpt: z.string(),
  sourceUrl: z.string().optional(),
});

export const GenerateCaseResponseSchema = z.object({
  caseNumber: z.string().optional(),
  title: z.string(),
  shortTitle: z.string().optional(),
  summary: z.string(),
  facts: z.array(z.string()),
  claims: z.array(z.string()),
  defenses: z.array(z.string()),
  referencePrecedents: z.array(PrecedentSchema).optional().default([]),
  referenceStatutes: z.array(StatuteSchema).optional().default([]),
});

export const JudgeAnalysisResponseSchema = z.object({
  issue: z.string(),
  reasoning: z.string(),
  holding: z.string(),
  confidence: ConfidenceSchema.optional().default('medium'),
  statutes: z.array(StatuteSchema).optional().default([]),
  precedents: z.array(PrecedentSchema).optional().default([]),
  disclaimers: z.array(z.string()).optional().default([]),
});

export type GenerateCaseResponse = z.infer<typeof GenerateCaseResponseSchema>;
export type JudgeAnalysisResponse = z.infer<typeof JudgeAnalysisResponseSchema>;

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

/** קריאת השלמה עם JSON — לשימוש חוזר (ייבוא ממקרים אמיתיים וכו׳) */
export async function completeOpenAIJson(system: string, user: string): Promise<unknown> {
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
      temperature: 0.25,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`LLM HTTP ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty LLM response');
  }
  return extractJsonObject(text);
}

const GENERATE_SYSTEM = `You are a legal education assistant for Israeli law students (university level).
Generate a realistic *fictional* case skeleton for classroom simulation in Hebrew.
Rules:
- Output ONLY valid JSON matching the schema described in the user message. No markdown outside JSON.
- Cite real Israeli statutes and landmark precedents when you are confident they exist; use accurate citations (e.g. ע"א, בג"ץ, חוקים).
- If you are not sure about a citation, omit it or use a clearly generic educational placeholder — never invent a fake Supreme Court case number.
- Add field "sourceUrl" only when you know a stable public URL (court website, Knesset, etc.); otherwise omit.
- Tone: formal Hebrew legal style; suitable for moot court / virtual court.
- This is not legal advice.`;

const JUDGE_SYSTEM = `You are a legal education assistant simulating a judge's structured reasoning for Israeli law students.
Output ONLY valid JSON per the user schema. Hebrew for legal analysis.
Rules:
- Ground reasoning in the case facts and the provided statutes/precedents; if information is missing, say what is missing.
- Do not present binding legal advice. Include disclaimers in the JSON disclaimers array.
- Prefer citing real norms when confident; otherwise state uncertainty clearly.`;

export async function llmGenerateCase(input: {
  topic: string;
  track: string;
  level: string;
  judgeMode: string;
  caseId?: string;
}): Promise<GenerateCaseResponse> {
  const cacheInput = {
    topic: input.topic,
    track: input.track,
    level: input.level,
    judgeMode: input.judgeMode,
  };
  const user = JSON.stringify(
    {
      task: 'generate_case',
      schema: {
        caseNumber: 'string optional — realistic Israeli style case number for the court level',
        title: 'string — full case title in Hebrew',
        shortTitle: 'string optional',
        summary: 'string — 2–4 sentences',
        facts: 'string[] — 4–8 numbered-style facts as strings',
        claims: 'string[] — plaintiff / petitioner claims',
        defenses: 'string[] — defendant / respondent defenses',
        referencePrecedents: [
          {
            title: 'string',
            citation: 'string',
            court: 'magistrate | district | supreme | other',
            year: 'number optional',
            summary: 'string',
            relevance: 'string — why it matters for this case',
            sourceUrl: 'string optional',
          },
        ],
        referenceStatutes: [
          { title: 'string', section: 'string optional', excerpt: 'string', sourceUrl: 'string optional' },
        ],
      },
      case_request: cacheInput,
    },
    null,
    2
  );

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const { value } = await withJsonCache<unknown>(
    {
      scope: 'vc_generate_case',
      payload: { model, system: GENERATE_SYSTEM, request: cacheInput },
      ttlDays: 90,
      model,
    },
    () => completeOpenAIJson(GENERATE_SYSTEM, user),
  );
  return GenerateCaseResponseSchema.parse(value);
}

export async function llmJudgeAnalysis(input: {
  issue: string;
  caseJson: {
    title: string;
    level: string;
    track: string;
    summary: string;
    facts: string[];
    claims: string[];
    defenses: string[];
    referenceStatutes: unknown[];
    referencePrecedents: unknown[];
  };
}): Promise<JudgeAnalysisResponse> {
  let enrichedInput = input;
  if (process.env.LEGAL_RAG_IN_JUDGE === 'true') {
    const ragQuery = [
      input.issue,
      input.caseJson.title,
      input.caseJson.summary,
      ...input.caseJson.facts.slice(0, 4),
    ].join('\n');
    const ragContext = await retrieveContextForPrompt({
      query: ragQuery.slice(0, 6000),
      matchThreshold: parseFloat(process.env.LEGAL_RAG_MATCH_THRESHOLD || '0.45'),
      matchCount: Math.min(8, parseInt(process.env.LEGAL_RAG_MATCH_COUNT || '4', 10) || 4),
      verifiedOnly: process.env.LEGAL_RAG_VERIFIED_ONLY === 'true',
    });
    if (ragContext) {
      enrichedInput = {
        ...input,
        issue: `${input.issue}\n\n[קטעים מהמאגר הווקטורי — יש לבסס ניתוח גם עליהם כשהם רלוונטיים]\n${ragContext}`,
      };
    }
  }

  const user = JSON.stringify(
    {
      task: 'judge_analysis',
      schema: {
        issue: 'string — restate the legal question',
        reasoning: 'string — structured multi-paragraph analysis in Hebrew',
        holding: 'string — tentative holding for educational discussion, not a real judgment',
        confidence: 'low | medium | high',
        statutes: 'array of { title, section?, excerpt, sourceUrl? } — norms applied',
        precedents: 'array of { title, citation, court?, year?, summary, relevance, sourceUrl? }',
        disclaimers: 'string[] — e.g. not legal advice, simulation only',
      },
      input: enrichedInput,
    },
    null,
    2
  );

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const { value } = await withJsonCache<unknown>(
    {
      scope: 'vc_judge_analysis',
      payload: { model, system: JUDGE_SYSTEM, user },
      ttlDays: 90,
      model,
    },
    () => completeOpenAIJson(JUDGE_SYSTEM, user),
  );
  return JudgeAnalysisResponseSchema.parse(value);
}

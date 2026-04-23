import { z } from 'zod';
import {
  GenerateCaseResponseSchema,
  completeOpenAIJson,
  isLlmConfigured,
} from './virtualCourtOpenAI.js';

const ImportMetaSchema = z.object({
  sourceDescription: z.string().optional().default('לא צוין'),
  anonymizationNote: z.string().optional().default('לא צוין'),
  provenanceUrls: z.array(z.string()).optional(),
});

export const RealCaseImportResponseSchema = GenerateCaseResponseSchema.merge(ImportMetaSchema);

export type RealCaseImportResponse = z.infer<typeof RealCaseImportResponseSchema>;

const IMPORT_SYSTEM = `You are a legal education assistant for Israeli university law students.
Convert real Israeli legal material (judgment excerpts, official summaries, or search snippets) into a structured case JSON for classroom simulation.

STRICT RULES:
- Output ONLY one JSON object matching the user schema. No markdown.
- Language: Hebrew (legal register).
- ANONYMIZATION (privacy): Replace real person names, ID numbers, exact addresses, and other identifying details with פלוני/פלונית א׳ ב׳ ג׳ and generic placeholders. In "anonymizationNote" briefly list categories of data removed (not the raw secrets).
- Do NOT invent a Supreme Court / District case number. If the source citation is unclear, omit "caseNumber" or write "לא צוין במקור".
- "referencePrecedents": if the source IS a named judgment, include it with accurate citation text as it appears in the source; add sourceUrl when the user/snippet provides a stable URL.
- "referenceStatutes": cite real statutes only when they clearly follow from the source; otherwise keep minimal.
- Add "sourceDescription" (1–2 sentences): what the input was (e.g. excerpt from judgment / snippets from search).
- This is not legal advice; simulation only.

If the input is too short or garbled, still return valid JSON with conservative facts and explain limitations in sourceDescription.`;

/** מתחמים מותרים לגירוד זהיר (HTTP GET) — הרחבה רק אחרי בדיקת תנאי שימוש */
const ALLOWED_HOST_SUFFIXES = [
  'court.gov.il',
  'supreme.court.gov.il',
  'data.gov.il',
  'www.gov.il',
];

function assertAllowedUrl(urlStr: string): URL {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    throw new Error('Invalid URL');
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') {
    throw new Error('Only http(s) URLs');
  }
  const host = u.hostname.toLowerCase();
  const ok = ALLOWED_HOST_SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`));
  if (!ok) {
    throw new Error(
      `Host not allowlisted. Allowed: ${ALLOWED_HOST_SUFFIXES.join(', ')}. For Nevo/Takdin use official API or paste text.`
    );
  }
  return u;
}

function htmlToPlainText(html: string): string {
  const noScript = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  return noScript
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120_000);
}

export async function fetchAllowedUrlPlainText(urlStr: string): Promise<{ text: string; finalUrl: string }> {
  const u = assertAllowedUrl(urlStr);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25_000);
  try {
    const res = await fetch(u.toString(), {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'LexStudyVirtualCourt/1.0 (educational; +https://contractlab.pro)',
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const html = await res.text();
    return { text: htmlToPlainText(html), finalUrl: res.url || u.toString() };
  } finally {
    clearTimeout(t);
  }
}

export interface SearchHit {
  title: string;
  link: string;
  snippet: string;
}

export async function googleCustomSearch(query: string): Promise<SearchHit[]> {
  const key = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY?.trim();
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID?.trim();
  if (!key || !cx) {
    throw new Error('GOOGLE_SEARCH_NOT_CONFIGURED');
  }
  const params = new URLSearchParams({
    key,
    cx,
    q: query,
    num: '8',
  });
  /** לדוגמה: w1 = שבוע אחרון, m1 = חודש — ראו מסמכי Google Custom Search (dateRestrict) */
  const dateRestrict = process.env.GOOGLE_CUSTOM_SEARCH_DATE_RESTRICT?.trim();
  if (dateRestrict) {
    params.set('dateRestrict', dateRestrict);
  }
  const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Google CSE ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    items?: Array<{ title?: string; link?: string; snippet?: string }>;
  };
  return (data.items || [])
    .filter((i) => i.link && i.title)
    .map((i) => ({
      title: i.title || '',
      link: i.link || '',
      snippet: i.snippet || '',
    }));
}

function buildImportUserPayload(input: {
  mode: 'pasted_text' | 'url_text' | 'search_snippets' | 'category_only';
  category?: string;
  courtLevel?: string;
  caseTrack?: string;
  text?: string;
  sourceUrl?: string;
  searchHits?: SearchHit[];
}): string {
  return JSON.stringify(
    {
      task: 'real_case_import',
      schema: {
        caseNumber: 'string optional',
        title: 'string',
        shortTitle: 'string optional',
        summary: 'string',
        facts: 'string[]',
        claims: 'string[]',
        defenses: 'string[]',
        referencePrecedents:
          '[{ title, citation, court?, year?, summary, relevance, sourceUrl? }]',
        referenceStatutes: '[{ title, section?, excerpt, sourceUrl? }]',
        sourceDescription: 'string',
        anonymizationNote: 'string',
        provenanceUrls: 'string[] optional',
      },
      input,
    },
    null,
    2
  );
}

async function runImportLlm(input: Parameters<typeof buildImportUserPayload>[0]): Promise<RealCaseImportResponse> {
  if (!isLlmConfigured()) {
    throw new Error('OPENAI_API_KEY not set');
  }
  const user = buildImportUserPayload(input);
  const raw = await completeOpenAIJson(IMPORT_SYSTEM, user);
  return RealCaseImportResponseSchema.parse(raw);
}

export async function importFromPastedText(params: {
  text: string;
  category?: string;
  courtLevel?: string;
  caseTrack?: string;
}): Promise<RealCaseImportResponse> {
  const text = params.text.trim().slice(0, 100_000);
  if (text.length < 80) {
    throw new Error('Text too short — paste a longer excerpt');
  }
  return runImportLlm({
    mode: 'pasted_text',
    category: params.category,
    courtLevel: params.courtLevel,
    caseTrack: params.caseTrack,
    text,
  });
}

export async function importFromUrl(params: {
  url: string;
  category?: string;
  courtLevel?: string;
  caseTrack?: string;
}): Promise<RealCaseImportResponse> {
  const { text, finalUrl } = await fetchAllowedUrlPlainText(params.url);
  if (text.length < 80) {
    throw new Error('Could not extract enough text from page');
  }
  return runImportLlm({
    mode: 'url_text',
    category: params.category,
    courtLevel: params.courtLevel,
    caseTrack: params.caseTrack,
    text,
    sourceUrl: finalUrl,
  });
}

export async function importFromCategoryWithOptionalSearch(params: {
  category: string;
  courtLevel?: string;
  caseTrack?: string;
}): Promise<RealCaseImportResponse> {
  let searchHits: SearchHit[] | undefined;
  try {
    const q = `(site:supreme.court.gov.il OR site:www.court.gov.il) פסק דין ${params.category}`;
    searchHits = await googleCustomSearch(q);
  } catch {
    searchHits = undefined;
  }

  if (searchHits && searchHits.length > 0) {
    return runImportLlm({
      mode: 'search_snippets',
      category: params.category,
      courtLevel: params.courtLevel,
      caseTrack: params.caseTrack,
      searchHits,
    });
  }

  return runImportLlm({
    mode: 'category_only',
    category: params.category,
    courtLevel: params.courtLevel,
    caseTrack: params.caseTrack,
    text:
      'No live web search available. Generate a conservative educational skeleton grounded in well-known Israeli law in this category. Clearly state in sourceDescription that no primary URL fetch was performed and citations must be verified by the instructor/student.',
  });
}

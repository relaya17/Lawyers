import { useMutation } from '@tanstack/react-query';
import { notifyMobileUnauthorized } from '../auth/mobileUnauthorized';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

export type RagCitation = {
  id: string;
  title: string | null;
  excerpt: string;
  sourceUrl: string | null;
  category: string | null;
  verificationStatus: string;
  similarity: number;
};

export type LegalRagResponse = {
  answer: string;
  citations: RagCitation[];
  usedVerifiedOnly: boolean;
};

/**
 * שאילתת RAG מלאה. דורש Bearer JWT — העבירי טוקן אחרי התחברות (מימוש עתידי).
 * ללא טוקן השרת יחזיר 401.
 */
export function useLegalAI(accessToken: string | null) {
  return useMutation({
    mutationFn: async (params: { query: string; verifiedOnly?: boolean }): Promise<LegalRagResponse> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      const res = await fetch(`${API}/legal/rag/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: params.query,
          matchThreshold: 0.45,
          matchCount: 4,
          verifiedOnly: params.verifiedOnly ?? false,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          notifyMobileUnauthorized();
        }
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      return res.json() as Promise<LegalRagResponse>;
    },
  });
}

import {
  AssistantChatResponse,
  DocumentAnalysisResponse,
  IssueClassificationResponse,
} from '../../server/services/aiService.js';
import { LegalSource, EmergencyResource } from '../../server/services/legalSources.js';

export interface DocumentAnalysisResult {
  analysis: DocumentAnalysisResponse;
  document: {
    filename: string;
    wordCount: number;
    characterCount: number;
    fileSizeBytes: number;
    isTruncated: boolean;
    previewText: string;
  };
}

export interface DocumentQAResult {
  answer: string;
  relevantExcerpts: string[];
  disclaimer: string;
}

// Client-side in-flight request deduplication map
const inflightRequests = new Map<string, Promise<any>>();

// Client-side memory cache for fast repeat access
const clientCache = new Map<string, { data: any; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const item = clientCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    clientCache.delete(key);
    return null;
  }
  return item.data as T;
}

function setCached<T>(key: string, data: T, ttlMs: number = 300000): void {
  clientCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function deduplicatedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key) as Promise<T>;
  }

  const promise = fetcher().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, promise);
  return promise;
}

export const api = {
  /**
   * Ask a legal question to the AI assistant
   */
  async askAssistant(
    question: string,
    jurisdiction: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    signal?: AbortSignal
  ): Promise<AssistantChatResponse> {
    const cacheKey = `assistant:${jurisdiction}:${question.trim().toLowerCase()}`;
    const cached = getCached<AssistantChatResponse>(cacheKey);
    if (cached) return cached;

    return deduplicatedFetch(cacheKey, async () => {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, jurisdiction, history }),
        signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Network error' }));
        throw new Error(err.message || 'Failed to communicate with AI Assistant');
      }

      const data = await res.json();
      setCached(cacheKey, data, 1800000); // 30 min cache
      return data;
    });
  },

  /**
   * Analyze an uploaded legal document or sample text
   */
  async analyzeDocument(
    params: {
      filename?: string;
      text?: string;
      base64Data?: string;
      mimeType?: string;
      jurisdiction: string;
    },
    signal?: AbortSignal
  ): Promise<DocumentAnalysisResult> {
    const key = `analyze:${params.jurisdiction}:${params.filename || 'raw'}:${(params.text || '').substring(0, 100)}`;
    const cached = getCached<DocumentAnalysisResult>(key);
    if (cached) return cached;

    return deduplicatedFetch(key, async () => {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Document analysis failed' }));
        throw new Error(err.message || 'Failed to analyze document');
      }

      const data = await res.json();
      setCached(key, data, 1800000);
      return data;
    });
  },

  /**
   * Ask follow-up question grounded strictly in document text
   */
  async askDocumentQA(
    documentText: string,
    question: string,
    jurisdiction: string,
    signal?: AbortSignal
  ): Promise<DocumentQAResult> {
    const key = `qa:${jurisdiction}:${question.trim().toLowerCase()}:${documentText.substring(0, 80)}`;
    const cached = getCached<DocumentQAResult>(key);
    if (cached) return cached;

    return deduplicatedFetch(key, async () => {
      const res = await fetch('/api/documents/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, question, jurisdiction }),
        signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Document Q&A query failed' }));
        throw new Error(err.message || 'Failed to answer question about document');
      }

      const data = await res.json();
      setCached(key, data, 1800000);
      return data;
    });
  },

  /**
   * Guided intake issue classifier
   */
  async classifyIssue(
    situationDescription: string,
    jurisdiction: string,
    signal?: AbortSignal
  ): Promise<IssueClassificationResponse> {
    const key = `classify:${jurisdiction}:${situationDescription.trim().toLowerCase()}`;
    const cached = getCached<IssueClassificationResponse>(key);
    if (cached) return cached;

    return deduplicatedFetch(key, async () => {
      const res = await fetch('/api/classifier/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situationDescription, jurisdiction }),
        signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Intake classification failed' }));
        throw new Error(err.message || 'Failed to classify legal issue');
      }

      const data = await res.json();
      setCached(key, data, 1800000);
      return data;
    });
  },

  /**
   * Fetch verified statutory sources and legal aid resources with client caching
   */
  async getResources(
    jurisdiction: string,
    category?: string,
    signal?: AbortSignal
  ): Promise<{ sources: LegalSource[]; count: number }> {
    const cacheKey = `res:${jurisdiction}:${category || 'All'}`;
    const cached = getCached<{ sources: LegalSource[]; count: number }>(cacheKey);
    if (cached) return cached;

    return deduplicatedFetch(cacheKey, async () => {
      const query = new URLSearchParams({ jurisdiction });
      if (category && category !== 'All') {
        query.append('category', category);
      }

      const res = await fetch(`/api/resources/list?${query.toString()}`, { signal });
      if (!res.ok) throw new Error('Failed to load authoritative legal resources');
      const data = await res.json();
      setCached(cacheKey, data, 3600000); // 1 hr cache
      return data;
    });
  },

  /**
   * Fetch emergency distress helplines with client caching
   */
  async getEmergencyHelplines(
    jurisdiction: string,
    signal?: AbortSignal
  ): Promise<{ helplines: EmergencyResource[] }> {
    const cacheKey = `emergencies:${jurisdiction}`;
    const cached = getCached<{ helplines: EmergencyResource[] }>(cacheKey);
    if (cached) return cached;

    return deduplicatedFetch(cacheKey, async () => {
      const query = new URLSearchParams({ jurisdiction });
      const res = await fetch(`/api/resources/emergencies?${query.toString()}`, { signal });
      if (!res.ok) throw new Error('Failed to load emergency contacts');
      const data = await res.json();
      setCached(cacheKey, data, 3600000);
      return data;
    });
  },
};


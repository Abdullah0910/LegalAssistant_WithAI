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

export const api = {
  /**
   * Ask a legal question to the AI assistant
   */
  async askAssistant(
    question: string,
    jurisdiction: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<AssistantChatResponse> {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, jurisdiction, history }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Network error' }));
      throw new Error(err.message || 'Failed to communicate with AI Assistant');
    }

    return res.json();
  },

  /**
   * Analyze an uploaded legal document or sample text
   */
  async analyzeDocument(params: {
    filename?: string;
    text?: string;
    base64Data?: string;
    mimeType?: string;
    jurisdiction: string;
  }): Promise<DocumentAnalysisResult> {
    const res = await fetch('/api/documents/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Document analysis failed' }));
      throw new Error(err.message || 'Failed to analyze document');
    }

    return res.json();
  },

  /**
   * Ask follow-up question grounded strictly in document text
   */
  async askDocumentQA(
    documentText: string,
    question: string,
    jurisdiction: string
  ): Promise<DocumentQAResult> {
    const res = await fetch('/api/documents/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentText, question, jurisdiction }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Document Q&A query failed' }));
      throw new Error(err.message || 'Failed to answer question about document');
    }

    return res.json();
  },

  /**
   * Guided intake issue classifier
   */
  async classifyIssue(
    situationDescription: string,
    jurisdiction: string
  ): Promise<IssueClassificationResponse> {
    const res = await fetch('/api/classifier/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situationDescription, jurisdiction }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Intake classification failed' }));
      throw new Error(err.message || 'Failed to classify legal issue');
    }

    return res.json();
  },

  /**
   * Fetch verified statutory sources and legal aid resources
   */
  async getResources(jurisdiction: string, category?: string): Promise<{ sources: LegalSource[]; count: number }> {
    const query = new URLSearchParams({ jurisdiction });
    if (category && category !== 'All') {
      query.append('category', category);
    }

    const res = await fetch(`/api/resources/list?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load authoritative legal resources');
    return res.json();
  },

  /**
   * Fetch emergency distress helplines
   */
  async getEmergencyHelplines(jurisdiction: string): Promise<{ helplines: EmergencyResource[] }> {
    const query = new URLSearchParams({ jurisdiction });
    const res = await fetch(`/api/resources/emergencies?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load emergency contacts');
    return res.json();
  },
};

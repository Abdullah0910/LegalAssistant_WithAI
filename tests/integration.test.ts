import { describe, it, expect } from 'vitest';
import {
  chatLegalAssistant,
  analyzeLegalDocument,
  classifyLegalIssue,
} from '../server/services/aiService.js';
import { extractDocumentText } from '../server/services/documentService.js';
import { DEMO_DOCUMENTS } from '../src/data/demoDocuments.js';

describe('Integration Tests: Document Text Extraction', () => {
  it('should correctly extract plain text from base64 string', async () => {
    const rawContent = 'TENANCY AGREEMENT: Landlord agrees to refund deposit in 30 days.';
    const base64 = Buffer.from(rawContent, 'utf-8').toString('base64');
    const doc = await extractDocumentText('test_agreement.txt', base64, 'text/plain');

    expect(doc.filename).toBe('test_agreement.txt');
    expect(doc.extractedText).toContain('TENANCY AGREEMENT');
    expect(doc.wordCount).toBeGreaterThan(5);
    expect(doc.characterCount).toBe(rawContent.length);
  });
});

describe('Integration Tests: AI Legal Services Core', () => {
  it('should generate structured analysis for tenancy deposit dispute', async () => {
    const sampleDoc = DEMO_DOCUMENTS[0];
    const analysis = await analyzeLegalDocument(sampleDoc.content, 'sample_tenancy.txt', 'India');

    expect(analysis).toBeDefined();
    expect(analysis.summary).toBeDefined();
    expect(analysis.documentType).toBeDefined();
    expect(Array.isArray(analysis.keyClauses)).toBe(true);
    expect(analysis.keyClauses.length).toBeGreaterThan(0);
    expect(Array.isArray(analysis.importantDates)).toBe(true);
    expect(Array.isArray(analysis.questionsForLawyer)).toBe(true);
    expect(analysis.disclaimer).toContain('legal');
  });

  it('should classify employment dispute with minimum needed information questions', async () => {
    const description = 'My company hasn\'t paid my salary for 2 months and says I cannot leave without paying them.';
    const classification = await classifyLegalIssue(description, 'India');

    expect(classification).toBeDefined();
    expect(classification.category).toBe('Employment');
    expect(classification.specificIssue).toBeDefined();
    expect(Array.isArray(classification.informationNeeded)).toBe(true);
    expect(classification.informationNeeded.length).toBeGreaterThan(0);
    expect(Array.isArray(classification.immediateActions)).toBe(true);
    expect(Array.isArray(classification.evidenceToPreserve)).toBe(true);
  });

  it('should provide structured plain-English assistant output for user question', async () => {
    const question = 'My landlord is refusing to return my security deposit. What are my options?';
    const response = await chatLegalAssistant(question, 'India');

    expect(response).toBeDefined();
    expect(response.understanding).toBeDefined();
    expect(Array.isArray(response.relevantLegalConcepts)).toBe(true);
    expect(Array.isArray(response.possibleNextSteps)).toBe(true);
    expect(Array.isArray(response.documentsToCollect)).toBe(true);
    expect(response.importantConsiderations.deadlines.length).toBeGreaterThan(0);
    expect(response.disclaimer).toBeDefined();
  });
});

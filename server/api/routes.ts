import { Router, Request, Response } from 'express';
import {
  chatLegalAssistant,
  analyzeLegalDocument,
  askDocumentQuestion,
  classifyLegalIssue,
} from '../services/aiService.js';
import {
  validateDocumentUpload,
  extractDocumentText,
} from '../services/documentService.js';
import {
  getSourcesForQuery,
  getEmergencyHelplines,
} from '../services/legalSources.js';
import {
  sanitizeInput,
  sanitizeFilename,
} from '../middleware/security.js';
import { resourcesCache, ResponseCache } from '../services/cacheService.js';
import { Metrics } from '../services/metrics.js';

export const apiRouter = Router();

/**
 * Health check endpoint
 */
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'LegalEase AI Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Performance & Metrics Observability Endpoint
 */
apiRouter.get('/metrics', (req: Request, res: Response) => {
  res.json(Metrics.getSummary());
});

/**
 * AI Legal Assistant Chat Endpoint
 */
apiRouter.post('/assistant/chat', async (req: Request, res: Response) => {
  try {
    const rawQuestion = req.body?.question;
    const jurisdiction = sanitizeInput(req.body?.jurisdiction || 'India');
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim().length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'A non-empty question string is required.',
      });
      return;
    }

    const question = sanitizeInput(rawQuestion);
    if (question.length > 5000) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Question exceeds maximum permitted length of 5,000 characters.',
      });
      return;
    }

    const response = await chatLegalAssistant(question, jurisdiction, history);
    res.json(response);
  } catch (err: any) {
    console.error('[API] /assistant/chat error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your legal inquiry. Please try again.',
    });
  }
});

/**
 * Legal Document Analyzer Endpoint
 */
apiRouter.post('/documents/analyze', async (req: Request, res: Response) => {
  try {
    const { filename: rawFilename, base64Data, text, mimeType = 'text/plain', jurisdiction = 'India' } = req.body || {};

    let extractedText = '';
    let docMetadata: any = {};
    const safeFilename = sanitizeFilename(rawFilename || 'uploaded_document.txt');
    const safeJurisdiction = sanitizeInput(jurisdiction);

    if (base64Data && typeof base64Data === 'string') {
      const bufferLen = Math.floor((base64Data.length * 3) / 4);
      const validation = validateDocumentUpload(safeFilename, mimeType, bufferLen);
      if (!validation.valid) {
        res.status(400).json({ error: 'Validation Error', message: validation.error });
        return;
      }

      const extracted = await extractDocumentText(safeFilename, base64Data, mimeType);
      extractedText = extracted.extractedText;
      docMetadata = {
        filename: extracted.filename,
        wordCount: extracted.wordCount,
        characterCount: extracted.characterCount,
        fileSizeBytes: extracted.fileSizeBytes,
        isTruncated: extracted.isTruncated,
      };
    } else if (text && typeof text === 'string') {
      const cleanText = sanitizeInput(text);
      if (cleanText.length === 0) {
        res.status(400).json({ error: 'Validation Error', message: 'Document text cannot be empty.' });
        return;
      }
      extractedText = cleanText;
      docMetadata = {
        filename: safeFilename,
        wordCount: cleanText.split(/\s+/).filter(Boolean).length,
        characterCount: cleanText.length,
        fileSizeBytes: Buffer.byteLength(cleanText, 'utf-8'),
        isTruncated: cleanText.length >= 100000,
      };
    } else {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Please provide either document base64Data or raw text content.',
      });
      return;
    }

    const analysis = await analyzeLegalDocument(extractedText, safeFilename, safeJurisdiction);
    res.json({
      analysis,
      document: {
        ...docMetadata,
        previewText: extractedText.substring(0, 10000), // First 10k chars for preview
      },
    });
  } catch (err: any) {
    console.error('[API] /documents/analyze error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong while analyzing your document. Please try again.',
    });
  }
});

/**
 * Document Follow-up Q&A Endpoint
 */
apiRouter.post('/documents/qa', async (req: Request, res: Response) => {
  try {
    const { documentText, question: rawQuestion, jurisdiction = 'India' } = req.body || {};

    if (!documentText || typeof documentText !== 'string') {
      res.status(400).json({ error: 'Bad Request', message: 'Document text context is required.' });
      return;
    }

    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim().length === 0) {
      res.status(400).json({ error: 'Bad Request', message: 'A non-empty question is required.' });
      return;
    }

    const question = sanitizeInput(rawQuestion);
    const safeJurisdiction = sanitizeInput(jurisdiction);
    const result = await askDocumentQuestion(documentText, question, safeJurisdiction);

    res.json(result);
  } catch (err: any) {
    console.error('[API] /documents/qa error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while answering your document inquiry. Please try again.',
    });
  }
});

/**
 * Legal Issue Classifier & Intake Endpoint
 */
apiRouter.post('/classifier/intake', async (req: Request, res: Response) => {
  try {
    const rawDescription = req.body?.situationDescription;
    const jurisdiction = sanitizeInput(req.body?.jurisdiction || 'India');

    if (!rawDescription || typeof rawDescription !== 'string' || rawDescription.trim().length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Please describe your legal situation.',
      });
      return;
    }

    const situation = sanitizeInput(rawDescription);
    const result = await classifyLegalIssue(situation, jurisdiction);
    res.json(result);
  } catch (err: any) {
    console.error('[API] /classifier/intake error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while classifying your issue. Please try again.',
    });
  }
});

/**
 * Authoritative Legal Resources Directory Endpoint
 */
apiRouter.get('/resources/list', (req: Request, res: Response) => {
  const jurisdiction = sanitizeInput((req.query.jurisdiction as string) || 'India');
  const category = req.query.category ? sanitizeInput(req.query.category as string) : undefined;
  const cacheKey = ResponseCache.generateKey('res_list', { jurisdiction, category });

  const cached = resourcesCache.get(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    res.setHeader('X-Cache', 'HIT');
    res.json(cached);
    return;
  }

  const sources = getSourcesForQuery(jurisdiction, category);
  const payload = {
    jurisdiction,
    category: category || 'All',
    count: sources.length,
    sources,
  };
  resourcesCache.set(cacheKey, payload);

  res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
  res.setHeader('X-Cache', 'MISS');
  res.json(payload);
});

/**
 * Emergency Helplines & Rapid Distress Endpoint
 */
apiRouter.get('/resources/emergencies', (req: Request, res: Response) => {
  const jurisdiction = sanitizeInput((req.query.jurisdiction as string) || 'India');
  const cacheKey = ResponseCache.generateKey('res_emergencies', { jurisdiction });

  const cached = resourcesCache.get(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    res.setHeader('X-Cache', 'HIT');
    res.json(cached);
    return;
  }

  const helplines = getEmergencyHelplines(jurisdiction);
  const payload = {
    jurisdiction,
    helplines,
  };
  resourcesCache.set(cacheKey, payload);

  res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
  res.setHeader('X-Cache', 'MISS');
  res.json(payload);
});

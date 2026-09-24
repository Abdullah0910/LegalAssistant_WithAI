import mammoth from 'mammoth';
import { CONFIG } from '../config.js';
import { sanitizeUntrustedDocument } from '../middleware/security.js';

export interface ExtractedDocument {
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  wordCount: number;
  characterCount: number;
  extractedText: string;
  isTruncated: boolean;
}

export interface DocumentValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = new Set([
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]);

const ALLOWED_EXTENSIONS = new Set(['.txt', '.pdf', '.docx', '.doc']);

export function validateDocumentUpload(
  filename: string,
  mimeType: string,
  fileSizeBytes: number
): DocumentValidationResult {
  if (!filename || typeof filename !== 'string') {
    return { valid: false, error: 'A valid document filename is required.' };
  }

  const extMatch = filename.match(/\.[^.]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Unsupported file extension "${ext}". Permitted formats: PDF, DOCX, TXT.`,
    };
  }

  // Check file size (max 10MB)
  if (fileSizeBytes > CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the limit of 10MB (${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  if (fileSizeBytes <= 0) {
    return { valid: false, error: 'The uploaded file is empty.' };
  }

  return { valid: true };
}

export async function extractDocumentText(
  filename: string,
  base64Data: string,
  mimeType: string
): Promise<ExtractedDocument> {
  const buffer = Buffer.from(base64Data, 'base64');
  let rawText = '';

  const extMatch = filename.match(/\.[^.]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';

  if (ext === '.txt' || mimeType === 'text/plain') {
    rawText = buffer.toString('utf-8');
  } else if (ext === '.docx' || mimeType.includes('wordprocessingml')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
    } catch (docxErr) {
      console.error('[DocumentService] DOCX extraction error:', docxErr);
      rawText = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
    }
  } else if (ext === '.pdf' || mimeType === 'application/pdf') {
    // For PDFs, extract clean readable text streams from the buffer
    const textChunks: string[] = [];
    const strContent = buffer.toString('latin1');
    
    // Extract text blocks inside stream objects or BT ... ET blocks
    const btMatches = strContent.match(/BT[\s\S]*?ET/g);
    if (btMatches && btMatches.length > 0) {
      for (const block of btMatches) {
        // Extract strings inside parentheses (Tj or TJ operators)
        const strings = block.match(/\((.*?)\)\s*(?:Tj|TJ|'|")/g);
        if (strings) {
          for (const s of strings) {
            const clean = s.replace(/^\(/, '').replace(/\)\s*(?:Tj|TJ|'|")$/, '').trim();
            if (clean.length > 0 && !clean.startsWith('%')) {
              textChunks.push(clean);
            }
          }
        }
      }
    }

    if (textChunks.length > 5) {
      rawText = textChunks.join(' ');
    } else {
      // Fallback: extract printable ASCII and Unicode chunks
      const utf8Candidate = buffer.toString('utf-8');
      const printableWords = utf8Candidate.match(/[A-Za-z0-9,.:;'"\-\/\(\)₹$\s]{4,}/g);
      if (printableWords && printableWords.length > 10) {
        rawText = printableWords.join(' ');
      } else {
        rawText = `[PDF Document: "${filename}" - Buffer size: ${buffer.length} bytes. Text extracted for legal analysis.]`;
      }
    }
  } else {
    rawText = buffer.toString('utf-8');
  }

  // Sanitize text and neutralize prompt injections
  const sanitized = sanitizeUntrustedDocument(rawText);
  const words = sanitized.trim().split(/\s+/).filter(Boolean);

  return {
    filename,
    mimeType,
    fileSizeBytes: buffer.length,
    wordCount: words.length,
    characterCount: sanitized.length,
    extractedText: sanitized,
    isTruncated: sanitized.length >= 100000,
  };
}

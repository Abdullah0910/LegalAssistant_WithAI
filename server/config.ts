import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DEFAULT_MODEL: 'gemini-3.8-flash',
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 60, // 60 requests per minute per IP
  DEFAULT_JURISDICTION: 'India',
  AI_TIMEOUT_MS: 25000, // 25s timeout for AI requests
  CACHE_TTL_MS: 30 * 60 * 1000, // 30 minutes in-memory cache
  MAX_DOCUMENT_ANALYSIS_CHARS: 35000, // Optimize context window to top high-signal content
  MAX_RETRIES: 2, // Maximum 2 retries with exponential backoff
};

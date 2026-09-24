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
};

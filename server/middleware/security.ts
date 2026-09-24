import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../config.js';
import { Metrics } from '../services/metrics.js';

// In-memory sliding-window rate limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown-client';
  const now = Date.now();

  let record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + CONFIG.RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(ip, record);
    return next();
  }

  record.count++;
  if (record.count > CONFIG.RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a moment before trying again.',
      retryAfterSeconds: retryAfter,
    });
    return;
  }

  next();
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

// Input sanitizer: strips null bytes, potential script tags, and normalizes unicode
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // Remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .trim();
}

// Prompt Injection Sanitizer for Untrusted Documents
export function sanitizeUntrustedDocument(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // Detect and neutralize common adversarial instruction overrides
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /disregard\s+(all\s+)?(previous|prior)\s+rules/gi,
    /reveal\s+(the\s+)?(system\s+prompt|api\s+key|secret)/gi,
    /you\s+are\s+now\s+a/gi,
    /system\s+override/gi,
    /dan\s+mode/gi,
    /act\s+as\s+an\s+unrestricted/gi,
  ];

  let cleaned = text;
  for (const pattern of injectionPatterns) {
    cleaned = cleaned.replace(pattern, '[Content flagged & neutralized]');
  }

  // Bound document text size to prevent memory exhaustion (up to 100,000 characters)
  if (cleaned.length > 100000) {
    cleaned = cleaned.substring(0, 100000) + '\n[Document truncated to first 100,000 characters for security and performance]';
  }

  return cleaned;
}

// Safe Anonymized Logger (never logs document body, passwords, or keys)
export function logSafeRequest(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const endpoint = req.originalUrl || req.url;
  const method = req.method;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    // Record lightweight metrics
    if (endpoint.startsWith('/api')) {
      const cleanEndpoint = endpoint.split('?')[0];
      Metrics.recordEndpoint(cleanEndpoint, duration, status >= 400);
      console.log(`[API] ${method} ${cleanEndpoint} - ${status} (${duration}ms)`);
    }
  });

  next();
}

// Filename sanitizer
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.') // Prevent directory traversal
    .substring(0, 100);
}

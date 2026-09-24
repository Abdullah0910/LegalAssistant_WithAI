import crypto from 'crypto';
import { CONFIG } from '../config.js';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class ResponseCache<T = any> {
  private store = new Map<string, CacheEntry<T>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private ttlMs: number = CONFIG.CACHE_TTL_MS, private maxEntries: number = 200) {
    this.cleanupInterval = setInterval(() => this.purgeExpired(), 60000);
    if (typeof this.cleanupInterval.unref === 'function') {
      this.cleanupInterval.unref();
    }
  }

  static generateKey(prefix: string, payload: any): string {
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 24);
    return `${prefix}:${hash}`;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T, customTtlMs?: number): void {
    // Enforce max entries to prevent memory leaks (LRU eviction of oldest inserted)
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    const ttl = customTtlMs ?? this.ttlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.store.clear();
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  size(): number {
    return this.store.size;
  }
}

// Global caches for safe response reuse
export const assistantCache = new ResponseCache(CONFIG.CACHE_TTL_MS, 150);
export const documentAnalysisCache = new ResponseCache(CONFIG.CACHE_TTL_MS, 100);
export const issueClassificationCache = new ResponseCache(CONFIG.CACHE_TTL_MS, 150);
export const documentQACache = new ResponseCache(CONFIG.CACHE_TTL_MS, 200);
export const resourcesCache = new ResponseCache(CONFIG.CACHE_TTL_MS * 2, 50); // 1 hr for static official portals

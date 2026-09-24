/**
 * Performance & Metrics Tracker
 * Anonymized, non-PII, lightweight memory metrics for observability
 */

interface EndpointMetric {
  count: number;
  totalDurationMs: number;
  minDurationMs: number;
  maxDurationMs: number;
  lastDurationMs: number;
  errors: number;
}

interface AIMetric {
  totalCalls: number;
  cacheHits: number;
  fallbacksTriggered: number;
  totalLatencyMs: number;
}

const endpointMetrics = new Map<string, EndpointMetric>();
const aiMetrics: AIMetric = {
  totalCalls: 0,
  cacheHits: 0,
  fallbacksTriggered: 0,
  totalLatencyMs: 0,
};

export const Metrics = {
  recordEndpoint(endpoint: string, durationMs: number, isError: boolean = false) {
    let metric = endpointMetrics.get(endpoint);
    if (!metric) {
      metric = {
        count: 0,
        totalDurationMs: 0,
        minDurationMs: durationMs,
        maxDurationMs: durationMs,
        lastDurationMs: durationMs,
        errors: 0,
      };
      endpointMetrics.set(endpoint, metric);
    }

    metric.count++;
    metric.totalDurationMs += durationMs;
    metric.lastDurationMs = durationMs;
    metric.minDurationMs = Math.min(metric.minDurationMs, durationMs);
    metric.maxDurationMs = Math.max(metric.maxDurationMs, durationMs);
    if (isError) metric.errors++;
  },

  recordAICall(latencyMs: number, wasCacheHit: boolean = false, wasFallback: boolean = false) {
    aiMetrics.totalCalls++;
    if (wasCacheHit) {
      aiMetrics.cacheHits++;
    } else {
      aiMetrics.totalLatencyMs += latencyMs;
    }
    if (wasFallback) {
      aiMetrics.fallbacksTriggered++;
    }
  },

  getSummary() {
    const endpoints: Record<string, {
      calls: number;
      avgDurationMs: number;
      minDurationMs: number;
      maxDurationMs: number;
      errors: number;
    }> = {};

    for (const [ep, m] of endpointMetrics.entries()) {
      endpoints[ep] = {
        calls: m.count,
        avgDurationMs: m.count > 0 ? Math.round(m.totalDurationMs / m.count) : 0,
        minDurationMs: m.minDurationMs,
        maxDurationMs: m.maxDurationMs,
        errors: m.errors,
      };
    }

    const nonCachedCalls = aiMetrics.totalCalls - aiMetrics.cacheHits;
    return {
      uptimeSeconds: Math.round(process.uptime()),
      endpoints,
      ai: {
        totalRequests: aiMetrics.totalCalls,
        cacheHits: aiMetrics.cacheHits,
        cacheHitRate: aiMetrics.totalCalls > 0 ? (aiMetrics.cacheHits / aiMetrics.totalCalls * 100).toFixed(1) + '%' : '0%',
        fallbacksTriggered: aiMetrics.fallbacksTriggered,
        avgNonCachedLatencyMs: nonCachedCalls > 0 ? Math.round(aiMetrics.totalLatencyMs / nonCachedCalls) : 0,
      },
    };
  },
};

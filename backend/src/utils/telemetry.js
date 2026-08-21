/**
 * PromoAlign Telemetry & LLM Observability Metrics Store
 */

const telemetryStore = {
  totalRequests: 0,
  totalTokens: 0,
  totalCostUsd: 0,
  fallbackCount: 0,
  llmCalls: [],
  fallbacks: [],
  providerStats: {
    groq: { calls: 0, successes: 0, errors: 0, totalLatencyMs: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 },
    gemini: { calls: 0, successes: 0, errors: 0, totalLatencyMs: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 },
    local_rule: { calls: 0, successes: 0, errors: 0, totalLatencyMs: 0 },
    python_ml: { calls: 0, successes: 0, errors: 0, totalLatencyMs: 0 },
    js_ml_fallback: { calls: 0, successes: 0, errors: 0, totalLatencyMs: 0 }
  }
};

/**
 * Price Model per 1,000 tokens (USD)
 */
const PRICING = {
  groq: { inputPer1k: 0.00059, outputPer1k: 0.00079 },
  gemini: { inputPer1k: 0.000075, outputPer1k: 0.00030 }
};

/**
 * Estimates token count from string length (~4 chars per token)
 */
export function estimateTokenCount(text = '') {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Calculates estimated USD cost for LLM invocation
 */
export function calculateLlmCost(provider, inputTokens, outputTokens) {
  const price = PRICING[provider];
  if (!price) return 0;
  const inputCost = (inputTokens / 1000) * price.inputPer1k;
  const outputCost = (outputTokens / 1000) * price.outputPer1k;
  return +(inputCost + outputCost).toFixed(6);
}

/**
 * Log per-call LLM telemetry record
 */
export function recordLlmTelemetry({ provider, latencyMs, inputText, outputText, status = 'SUCCESS', correlationId = 'SYS' }) {
  telemetryStore.totalRequests++;

  const inputTokens = estimateTokenCount(inputText);
  const outputTokens = estimateTokenCount(outputText);
  const totalTokens = inputTokens + outputTokens;
  const costUsd = calculateLlmCost(provider, inputTokens, outputTokens);

  telemetryStore.totalTokens += totalTokens;
  telemetryStore.totalCostUsd = +(telemetryStore.totalCostUsd + costUsd).toFixed(6);

  if (!telemetryStore.providerStats[provider]) {
    telemetryStore.providerStats[provider] = { calls: 0, successes: 0, errors: 0, totalLatencyMs: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 };
  }

  const stat = telemetryStore.providerStats[provider];
  stat.calls++;
  if (status === 'SUCCESS') stat.successes++;
  else stat.errors++;

  stat.totalLatencyMs += latencyMs;
  stat.inputTokens += inputTokens;
  stat.outputTokens += outputTokens;
  stat.costUsd = +(stat.costUsd + costUsd).toFixed(6);

  telemetryStore.llmCalls.push({
    timestamp: new Date().toISOString(),
    correlationId,
    provider,
    status,
    latencyMs,
    inputTokens,
    outputTokens,
    totalTokens,
    costUsd
  });

  // Keep last 100 LLM calls in memory
  if (telemetryStore.llmCalls.length > 100) {
    telemetryStore.llmCalls.shift();
  }
}

/**
 * Record Fallback Trigger Event
 */
export function recordFallbackTrigger(breakerName, reason) {
  telemetryStore.fallbackCount++;
  telemetryStore.fallbacks.push({
    timestamp: new Date().toISOString(),
    breakerName,
    reason
  });
  if (telemetryStore.fallbacks.length > 50) {
    telemetryStore.fallbacks.shift();
  }
}

/**
 * Returns Summary Metrics Report for /api/metrics endpoint
 */
export function getMetricsSummary(circuitBreakerMap = {}) {
  const providerSummaries = {};

  Object.entries(telemetryStore.providerStats).forEach(([provider, stat]) => {
    const avgLatencyMs = stat.calls > 0 ? Math.round(stat.totalLatencyMs / stat.calls) : 0;
    providerSummaries[provider] = {
      calls: stat.calls,
      successes: stat.successes,
      errors: stat.errors,
      avgLatencyMs,
      inputTokens: stat.inputTokens,
      outputTokens: stat.outputTokens,
      costUsd: stat.costUsd
    };
  });

  const breakerStates = {};
  Object.entries(circuitBreakerMap).forEach(([name, breaker]) => {
    breakerStates[name] = {
      state: breaker.getState(),
      failureCount: breaker.failureCount,
      lastStateChange: new Date(breaker.lastStateChange).toISOString()
    };
  });

  return {
    timestamp: new Date().toISOString(),
    totalRequests: telemetryStore.totalRequests,
    totalTokens: telemetryStore.totalTokens,
    totalEstimatedCostUsd: `$${telemetryStore.totalCostUsd.toFixed(5)}`,
    fallbackTriggerCount: telemetryStore.fallbackCount,
    providerSummaries,
    circuitBreakers: breakerStates,
    recentFallbacks: telemetryStore.fallbacks.slice(-10),
    recentLlmCalls: telemetryStore.llmCalls.slice(-5)
  };
}

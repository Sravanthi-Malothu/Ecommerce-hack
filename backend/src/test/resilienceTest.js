import { CircuitBreaker, CIRCUIT_STATES } from '../utils/circuitBreaker.js';
import { asyncLocalStorage, getCorrelationId, logger } from '../utils/logger.js';
import { recordLlmTelemetry, getMetricsSummary } from '../utils/telemetry.js';

console.log('🧪 Testing Resilience, Circuit Breakers & Observability Engine...\n');

// 1. Test Correlation ID AsyncLocalStorage Context
asyncLocalStorage.run({ correlationId: 'TEST_REQ_123' }, () => {
  const currentId = getCorrelationId();
  console.log(`✅ [Correlation ID] Context Propagation Test: ${currentId}`);
  if (currentId !== 'TEST_REQ_123') throw new Error('Correlation ID failed to propagate');
});

// 2. Test Circuit Breaker FSM State Transitions
const testBreaker = new CircuitBreaker('Test_Breaker', { failureThreshold: 3, resetTimeoutMs: 100 });

async function runCircuitBreakerTests() {
  console.log(`✅ [Circuit Breaker] Initial State: ${testBreaker.getState()}`);
  if (testBreaker.getState() !== CIRCUIT_STATES.CLOSED) throw new Error('Initial state must be CLOSED');

  // Trigger 3 consecutive failures to trip to OPEN state
  for (let i = 1; i <= 3; i++) {
    await testBreaker.execute(
      () => Promise.reject(new Error(`Simulated Error ${i}`)),
      (err) => 'FALLBACK_OK'
    );
  }

  console.log(`✅ [Circuit Breaker] Post-3 Failures State: ${testBreaker.getState()}`);
  if (testBreaker.getState() !== CIRCUIT_STATES.OPEN) throw new Error('State must be OPEN after 3 failures');

  // Immediate execution while OPEN should trigger fast fallback
  const fastFallbackResult = await testBreaker.execute(
    () => Promise.resolve('SHOULD_NOT_EXECUTE'),
    (err) => 'FAST_FALLBACK_OK'
  );
  console.log(`✅ [Circuit Breaker] Fast-trip Fallback Result: ${fastFallbackResult}`);
  if (fastFallbackResult !== 'FAST_FALLBACK_OK') throw new Error('Fast-trip fallback failed');

  // Wait 120ms for reset timeout to elapse -> transitions to HALF_OPEN
  await new Promise((r) => setTimeout(r, 120));
  console.log(`✅ [Circuit Breaker] Post-Timeout State: ${testBreaker.getState()}`);
  if (testBreaker.getState() !== CIRCUIT_STATES.HALF_OPEN) throw new Error('State must be HALF_OPEN after timeout');

  // Trial request succeeds -> recovers back to CLOSED state
  const trialResult = await testBreaker.execute(
    () => Promise.resolve('SUCCESSFUL_RECOVERY'),
    (err) => 'RECOVERY_FAILED'
  );
  console.log(`✅ [Circuit Breaker] Trial Recovery Result: ${trialResult}`);
  console.log(`✅ [Circuit Breaker] Restored State: ${testBreaker.getState()}`);
  if (testBreaker.getState() !== CIRCUIT_STATES.CLOSED) throw new Error('State must restore to CLOSED after recovery');

  // 3. Test Telemetry Metrics Accumulation
  recordLlmTelemetry({ provider: 'groq', latencyMs: 145, inputText: 'Test prompt', outputText: 'Test reply text', status: 'SUCCESS', correlationId: 'TEST_REQ_123' });
  recordLlmTelemetry({ provider: 'gemini', latencyMs: 210, inputText: 'Test prompt 2', outputText: 'Test reply text 2', status: 'SUCCESS', correlationId: 'TEST_REQ_123' });

  const summary = getMetricsSummary({ testBreaker });
  console.log(`\n📊 [Telemetry Summary]:`);
  console.log(`   Total Requests: ${summary.totalRequests}`);
  console.log(`   Total Tokens  : ${summary.totalTokens}`);
  console.log(`   Total Cost    : ${summary.totalEstimatedCostUsd}`);
  console.log(`   Breakers      :`, summary.circuitBreakers);

  if (summary.totalRequests < 2 || !summary.totalTokens) {
    throw new Error('Telemetry accumulation failed');
  }

  console.log('\n🎉 ALL RESILIENCE & OBSERVABILITY TESTS PASSED SUCCESSFULLY!');
}

runCircuitBreakerTests();

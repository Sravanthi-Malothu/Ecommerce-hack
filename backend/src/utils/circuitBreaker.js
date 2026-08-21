import { logger } from './logger.js';
import { recordFallbackTrigger } from './telemetry.js';

export const CIRCUIT_STATES = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
};

/**
 * Production-Grade Lightweight Circuit Breaker
 */
export class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeoutMs = options.resetTimeoutMs || 15000; // 15 seconds
    this.state = CIRCUIT_STATES.CLOSED;
    this.failureCount = 0;
    this.lastStateChange = Date.now();
    this.nextAttemptTime = 0;
  }

  getState() {
    // Check if reset timeout has elapsed while OPEN
    if (this.state === CIRCUIT_STATES.OPEN && Date.now() >= this.nextAttemptTime) {
      this.transitionTo(CIRCUIT_STATES.HALF_OPEN);
    }
    return this.state;
  }

  transitionTo(newState) {
    const oldState = this.state;
    this.state = newState;
    this.lastStateChange = Date.now();

    if (newState === CIRCUIT_STATES.OPEN) {
      this.nextAttemptTime = Date.now() + this.resetTimeoutMs;
    }

    logger.warn(`⚡ Circuit Breaker State Transition: [${this.name}]`, {
      breakerName: this.name,
      fromState: oldState,
      toState: newState,
      failureCount: this.failureCount,
      resetTimeoutMs: this.resetTimeoutMs
    });
  }

  async execute(actionFn, fallbackFn) {
    const currentState = this.getState();

    // 1. If Breaker is OPEN, trip immediately to fallback without executing actionFn
    if (currentState === CIRCUIT_STATES.OPEN) {
      recordFallbackTrigger(this.name, 'CIRCUIT_OPEN_FAST_TRIP');
      logger.warn(`⚠️ [${this.name}] Circuit is OPEN. Executing Fallback instantly.`, {
        breakerName: this.name,
        state: this.state,
        nextAttemptInMs: Math.max(0, this.nextAttemptTime - Date.now())
      });
      return fallbackFn ? fallbackFn(new Error(`Circuit [${this.name}] is OPEN`)) : null;
    }

    // 2. Attempt Execution
    try {
      const result = await actionFn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      recordFallbackTrigger(this.name, err.message);
      if (fallbackFn) {
        logger.warn(`⚠️ [${this.name}] Action failed. Routing to secondary fallback handler.`, {
          breakerName: this.name,
          error: err.message
        });
        return fallbackFn(err);
      }
      throw err;
    }
  }

  onSuccess() {
    if (this.state === CIRCUIT_STATES.HALF_OPEN) {
      logger.info(`✅ [${this.name}] Trial request succeeded in HALF_OPEN state. Restoring circuit to CLOSED.`, {
        breakerName: this.name
      });
    }
    this.failureCount = 0;
    this.state = CIRCUIT_STATES.CLOSED;
  }

  onFailure(err) {
    this.failureCount++;
    logger.warn(`❌ [${this.name}] Execution failure recorded (${this.failureCount}/${this.failureThreshold}).`, {
      breakerName: this.name,
      failureCount: this.failureCount,
      error: err.message
    });

    if (this.state === CIRCUIT_STATES.HALF_OPEN || this.failureCount >= this.failureThreshold) {
      this.transitionTo(CIRCUIT_STATES.OPEN);
    }
  }
}

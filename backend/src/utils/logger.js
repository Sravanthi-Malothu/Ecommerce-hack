import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Returns current Correlation ID from AsyncLocalStorage context, or 'SYS_INIT' if outside request.
 */
export function getCorrelationId() {
  const store = asyncLocalStorage.getStore();
  return store && store.correlationId ? store.correlationId : 'SYS_INIT';
}

/**
 * Structured Logger for PromoAlign AI
 */
export const logger = {
  info: (message, meta = {}) => {
    const correlationId = getCorrelationId();
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      correlationId,
      message,
      ...meta
    }));
  },

  warn: (message, meta = {}) => {
    const correlationId = getCorrelationId();
    console.warn(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      correlationId,
      message,
      ...meta
    }));
  },

  error: (message, meta = {}) => {
    const correlationId = getCorrelationId();
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      correlationId,
      message,
      ...meta
    }));
  }
};

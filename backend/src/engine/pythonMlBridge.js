import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { runPredictiveMlAnalysis } from './predictiveMlEngine.js';
import { CircuitBreaker } from '../utils/circuitBreaker.js';
import { logger, getCorrelationId } from '../utils/logger.js';
import { recordLlmTelemetry } from '../utils/telemetry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScriptPath = path.join(__dirname, '../ml/ml_predictive_engine.py');

// Instantiates Circuit Breaker for Python IPC ML Engine
export const pythonMlBreaker = new CircuitBreaker('Python_ML_Bridge', {
  failureThreshold: 3,
  resetTimeoutMs: 15000 // 15s reset window
});

/**
 * Executes Python ML Predictive Engine via asynchronous IPC process.
 * Protected by Circuit Breaker with JS Fallback Engine.
 */
export async function runPythonMlPredictiveEngine(inputs = {}) {
  const correlationId = getCorrelationId();

  return pythonMlBreaker.execute(
    () => executePythonIpcCall(inputs, correlationId),
    (err) => executeJsMlFallback(inputs, err.message, correlationId)
  );
}

function executePythonIpcCall(inputs, correlationId) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const inputJson = JSON.stringify(inputs);

    logger.info(`🐍 Invoking Python ML IPC process...`, {
      correlationId,
      scriptPath: pythonScriptPath
    });

    execFile('python3', [pythonScriptPath, inputJson], { timeout: 5000 }, (error, stdout, stderr) => {
      const latencyMs = Date.now() - startTime;

      if (error || !stdout) {
        const errorMsg = error ? error.message : stderr || 'Empty output from Python process';
        logger.warn(`⚠️ Python IPC process failed (${latencyMs}ms): ${errorMsg}`, { correlationId });
        recordLlmTelemetry({ provider: 'python_ml', latencyMs, inputText: inputJson, outputText: '', status: 'ERROR', correlationId });
        return reject(new Error(errorMsg));
      }

      try {
        const pythonResults = JSON.parse(stdout.trim());
        logger.info(`✅ Python ML IPC execution succeeded (${latencyMs}ms)`, { correlationId });
        recordLlmTelemetry({ provider: 'python_ml', latencyMs, inputText: inputJson, outputText: stdout, status: 'SUCCESS', correlationId });
        return resolve(pythonResults);
      } catch (parseErr) {
        logger.warn(`⚠️ Python output JSON parse failure: ${parseErr.message}`, { correlationId });
        recordLlmTelemetry({ provider: 'python_ml', latencyMs, inputText: inputJson, outputText: stdout, status: 'ERROR', correlationId });
        return reject(parseErr);
      }
    });
  });
}

function executeJsMlFallback(inputs, reason, correlationId) {
  const startTime = Date.now();
  logger.info(`⚡ Executing JS Predictive ML Fallback Engine`, { correlationId, reason });
  const jsFallback = runPredictiveMlAnalysis(inputs);
  const latencyMs = Date.now() - startTime;
  recordLlmTelemetry({ provider: 'js_ml_fallback', latencyMs, inputText: JSON.stringify(inputs), outputText: JSON.stringify(jsFallback), status: 'SUCCESS', correlationId });

  return {
    engine: 'JS Predictive ML Fallback Engine (Python Standby)',
    fallbackReason: reason,
    ...jsFallback
  };
}

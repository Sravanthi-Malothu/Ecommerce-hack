import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { runPredictiveMlAnalysis } from './predictiveMlEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScriptPath = path.join(__dirname, '../ml/ml_predictive_engine.py');

/**
 * Executes Python ML Predictive Engine via asynchronous IPC process.
 * Falls back to internal JavaScript engine if Python is unavailable.
 */
export async function runPythonMlPredictiveEngine(inputs = {}) {
  return new Promise((resolve) => {
    const inputJson = JSON.stringify(inputs);

    execFile('python3', [pythonScriptPath, inputJson], { timeout: 5000 }, (error, stdout, stderr) => {
      if (error || !stdout) {
        console.warn('⚠️ Python ML process warning/fallback:', error ? error.message : stderr);
        // Fallback to JS predictive ML engine
        const jsFallback = runPredictiveMlAnalysis(inputs);
        return resolve({
          engine: 'JS Fallback Engine (Python Standby)',
          ...jsFallback
        });
      }

      try {
        const pythonResults = JSON.parse(stdout.trim());
        return resolve(pythonResults);
      } catch (parseErr) {
        console.warn('⚠️ Python ML output JSON parse error, executing fallback:', parseErr.message);
        const jsFallback = runPredictiveMlAnalysis(inputs);
        return resolve({
          engine: 'JS Fallback Engine (Parse Retry)',
          ...jsFallback
        });
      }
    });
  });
}

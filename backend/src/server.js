import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import apiRouter from './routes/api.js';
import { asyncLocalStorage, logger } from './utils/logger.js';
import { groqBreaker, geminiBreaker } from './engine/chatEngine.js';
import { pythonMlBreaker } from './engine/pythonMlBridge.js';
import { getMetricsSummary } from './utils/telemetry.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Correlation ID AsyncLocalStorage Middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || req.headers['x-request-id'] || `req_${uuidv4().slice(0, 8)}`;
  res.setHeader('X-Correlation-ID', correlationId);

  asyncLocalStorage.run({ correlationId }, () => {
    logger.info(`📥 HTTP ${req.method} ${req.url}`, {
      correlationId,
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    next();
  });
});

// API Routes
app.use('/api', apiRouter);

/**
 * Detailed Production Health Endpoint
 * Checks Node Server, Python ML Bridge, Groq LLM API, and Gemini LLM API status
 */
app.get('/health', (req, res) => {
  const pythonState = pythonMlBreaker.getState();
  const groqState = groqBreaker.getState();
  const geminiState = geminiBreaker.getState();

  const isDegraded = pythonState === 'OPEN' || groqState === 'OPEN' || geminiState === 'OPEN';
  const overallStatus = isDegraded ? 'DEGRADED' : 'HEALTHY';

  const healthReport = {
    status: overallStatus,
    service: 'PromoAlign Backend & AI Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memoryUsageMb: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    },
    components: {
      nodeServer: { status: 'HEALTHY', message: 'Express Server Active' },
      pythonMlBridge: {
        status: pythonState === 'OPEN' ? 'DEGRADED (JS Fallback Active)' : 'HEALTHY',
        circuitBreakerState: pythonState,
        failuresCount: pythonMlBreaker.failureCount
      },
      groqLlmApi: {
        status: groqState === 'OPEN' ? 'UNREACHABLE (Circuit OPEN)' : 'HEALTHY',
        circuitBreakerState: groqState,
        failuresCount: groqBreaker.failureCount
      },
      geminiLlmApi: {
        status: geminiState === 'OPEN' ? 'UNREACHABLE (Circuit OPEN)' : 'HEALTHY',
        circuitBreakerState: geminiState,
        failuresCount: geminiBreaker.failureCount
      }
    }
  };

  res.status(isDegraded ? 200 : 200).json(healthReport);
});

app.listen(PORT, () => {
  console.log(`🚀 PromoAlign Backend Engine running on http://localhost:${PORT}`);
});

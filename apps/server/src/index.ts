import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { router as apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './db.js';
import {
  stripeWebhookHandler,
  stripeWebhookMiddleware,
} from './routes/billing.js';
import { shutdownPostHog } from './analytics/posthogServer.js';
import { attachSocketServer } from './realtime/socketServer.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet());
app.use(cookieParser());
const corsOriginEnv = process.env.CORS_ORIGIN;
const corsOrigins = corsOriginEnv
  ? corsOriginEnv.split(',').map((s) => s.trim()).filter(Boolean)
  : ['http://localhost:5852', 'http://localhost:5173'];

app.use(cors({
  origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
  credentials: true,
}));

// IMPORTANT: Stripe webhook must receive the raw body for signature verification,
// so it is registered BEFORE express.json(). All other routes use JSON as usual.
app.post('/api/billing/webhook', stripeWebhookMiddleware, stripeWebhookHandler);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRouter);

// Error handler
app.use(errorHandler);

// Explicit http.Server lets Socket.io attach to the same port.
const httpServer = http.createServer(app);
const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io listening on  ws://localhost:${PORT}/socket.io`);
});

attachSocketServer(httpServer);

connectDB();

// Graceful shutdown — flush PostHog events before exit so nothing is lost.
async function shutdown(signal: string): Promise<void> {
  console.log(`↘️  ${signal} received. Flushing analytics and closing server…`);
  await shutdownPostHog().catch((e) => console.error('PostHog shutdown error:', e));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

export default app;

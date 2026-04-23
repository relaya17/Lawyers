import { Router } from 'express';
import { aiRouter } from './ai.js';
import { virtualCourt2SyncRouter } from './virtualCourt2Sync.js';
import { virtualCourt2ImportRouter } from './virtualCourt2Import.js';
import { authRouter } from './auth.js';
import { billingRouter } from './billing.js';
import { legalRagRouter } from './legalRag.js';
import { adminLegalKnowledgeRouter } from './adminLegalKnowledge.js';
import { marketingRouter } from './marketing.js';
import { pleadingsGameRouter } from './pleadingsGame.js';
import { courtroomRouter } from './courtroom.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ api: 'ok' });
});

// Auth — JWT access + refresh HttpOnly, Zod, CSRF על refresh/logout
router.use('/auth', authRouter);

// AI proxy — keeps AI_API_KEY server-side only
router.use('/ai', aiRouter);

// RAG — שאילתות מבוססות מאגר ווקטורי (דורש התחברות)
router.use('/legal', legalRagRouter);

// Admin — ניהול מאגר ידע משפטי (רק role admin)
router.use('/admin/legal-knowledge', adminLegalKnowledgeRouter);

// Virtual Court 2 — שמירת צילום תיק לסנכרון (MongoDB)
router.use('/virtual-court-2', virtualCourt2SyncRouter);
router.use('/virtual-court-2', virtualCourt2ImportRouter);

// Billing / Stripe (checkout, portal, entitlements). Webhook is mounted
// separately in index.ts BEFORE express.json() so the raw body is preserved.
router.use('/billing', billingRouter);

// Marketing — waitlist (ללא אימות)
router.use('/marketing', marketingRouter);

// משחק כתבי טענות — אימון, הערכת AI, זכויות יסוד
router.use('/pleadings-game', pleadingsGameRouter);

// חדר דיונים חי — פרוטוקול בזמן אמת, וידאו, ראיות, תפקידים
router.use('/courtroom', courtroomRouter);

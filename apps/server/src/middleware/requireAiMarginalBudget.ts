import type { Request, Response, NextFunction } from 'express';
import { consumeAiCallIfNeeded } from '../billing/billingService.js';

/**
 * אחרי requireAuth. משתמשי Pro/Premium — ללא מגבלה.
 * Free במבצע — מונה יומי; Free בלי מבצע — 402.
 */
export function requireAiMarginalBudget() {
  return async function handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.authUser;
      if (!user) {
        res.status(401).json({ error: 'לא מאומת' });
        return;
      }
      const out = await consumeAiCallIfNeeded(user.id);
      if (out.ok) {
        next();
        return;
      }
      if (out.reason === 'payment_required') {
        res.status(402).json({
          error: 'נדרש מנוי בתשלום לשירותי AI',
          code: 'PAYMENT_REQUIRED',
          upgradeUrl: '/pricing',
        });
        return;
      }
      res.status(429).json({
        error:
          'הגעת למגבלת הקריאות החכמות היומית בתקופת ההשקה. שדרגי ל-Student Pro ללא הגבלה, או נסי שוב מחר.',
        code: 'PROMO_AI_LIMIT',
        used: out.used,
        limit: out.limit,
      });
    } catch (e) {
      next(e);
    }
  };
}

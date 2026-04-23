import type { Request, Response, NextFunction } from 'express';
import { getEntitlements } from '../billing/billingService.js';
import { PLANS } from '../billing/plans.js';

type EntitlementKey = keyof (typeof PLANS)['pro']['entitlements'];
type BooleanEntitlementKey = Exclude<EntitlementKey, 'monthlyQuestionQuota' | 'dailyQuestionLimit'>;

/**
 * Middleware factory: gates an endpoint behind a specific entitlement flag.
 * Requires `requireAuth` to have populated `req.authUser` first.
 *
 * Usage: router.post('/ai/chat', requireAuth, requireEntitlement('aiCoach'), handler);
 */
export function requireEntitlement(flag: BooleanEntitlementKey) {
  return async function handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.authUser;
      if (!user) {
        res.status(401).json({ error: 'לא מאומת' });
        return;
      }
      const ent = await getEntitlements(user.id);
      if (!ent.entitlements[flag]) {
        res.status(402).json({
          error: 'נדרש מנוי בתשלום',
          code: 'PAYMENT_REQUIRED',
          requiredFlag: flag,
          currentPlan: ent.plan,
          upgradeUrl: '/pricing',
        });
        return;
      }
      next();
    } catch (e) {
      const err = e as { message?: string };
      res.status(500).json({ error: err.message ?? 'Entitlement check failed' });
    }
  };
}

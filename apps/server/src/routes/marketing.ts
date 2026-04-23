import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { addWaitlistEmail } from '../marketing/waitlistRepo.js';
import { sendWaitlistConfirmation } from '../auth/emailService.js';

export const marketingRouter = Router();

const WaitlistBody = z.object({
  email: z.string().email().max(320),
  source: z.string().max(64).optional(),
});

marketingRouter.post('/waitlist', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = WaitlistBody.parse(req.body);
    const source = body.source ?? 'landing';
    const outcome = await addWaitlistEmail(body.email, source);
    if (outcome === 'inserted') {
      try {
        await sendWaitlistConfirmation(body.email.trim().toLowerCase());
      } catch (mailErr) {
        console.warn('[marketing] waitlist email failed', mailErr);
      }
    }
    res.status(201).json({ ok: true, alreadyRegistered: outcome === 'exists' });
  } catch (err) {
    next(err);
  }
});

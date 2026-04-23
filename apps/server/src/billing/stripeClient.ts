import Stripe from 'stripe';

let client: Stripe | null = null;

/**
 * Lazily create a Stripe client. Throws if STRIPE_SECRET_KEY is missing,
 * so pages that do not touch billing still work in dev without a key.
 */
export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set. Add it to apps/server/.env');
  }
  client = new Stripe(key, {
    apiVersion: '2026-03-25.dahlia',
    appInfo: { name: 'LexStudy', version: '1.0.0' },
  });
  return client;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

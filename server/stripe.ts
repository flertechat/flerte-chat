import Stripe from 'stripe';
import { ENV } from './_core/env';

if (!ENV.stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
});

console.log('[Stripe] Initialized with key prefix:', ENV.stripeSecretKey.substring(0, 8) + '...');


export interface CreateCheckoutSessionParams {
  userId: number;
  userEmail: string;
  userName: string;
  priceId: string;
  plan: string;
  interval: 'weekly' | 'monthly';
  origin: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const { userId, userEmail, userName, priceId, plan, interval, origin } = params;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      plan,
      interval,
    },
    allow_promotion_codes: true,
    success_url: `${origin}/app?checkout=success`,
    cancel_url: `${origin}/plans?checkout=cancelled`,
  });

  return session;
}

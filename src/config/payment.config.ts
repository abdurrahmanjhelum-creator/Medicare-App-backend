import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  currency: process.env.PAYMENT_CURRENCY || 'USD',
}));

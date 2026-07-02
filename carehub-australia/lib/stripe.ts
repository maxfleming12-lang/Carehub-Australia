import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
      typescript: true,
    })
  }
  return stripeClient
}

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      'Access to all resources',
      'Basic assessments',
      '5 AI document generations/month',
      '10 shift notes/month',
      '3 training courses',
      'Email support',
    ],
  },
  professional: {
    name: 'Professional',
    price: 79,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    features: [
      'Everything in Starter',
      'Unlimited assessments',
      '50 AI document generations/month',
      'Unlimited shift notes',
      'All training courses + certificates',
      'Priority support',
      'Team management (up to 5)',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Everything in Professional',
      'Unlimited AI document generations',
      'Custom AI document templates',
      'White-label options',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
}

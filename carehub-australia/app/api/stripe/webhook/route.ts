import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
])

type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise'

const planMapping: Record<string, SubscriptionTier> = {
  [process.env.STRIPE_STARTER_PRICE_ID || '']: 'starter',
  [process.env.STRIPE_PROFESSIONAL_PRICE_ID || '']: 'professional',
  [process.env.STRIPE_ENTERPRISE_PRICE_ID || '']: 'enterprise',
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 })
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  const supabase = createSupabaseAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id

        if (!userId || !session.subscription) break

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const priceId = subscription.items.data[0]?.price.id
        const tier = planMapping[priceId] || 'starter'

        await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_tier: tier,
            subscription_status: subscription.status === 'trialing' ? 'trialing' : 'active',
          })
          .eq('id', userId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (!userId) {
          // Try to find user by customer ID
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single()

          if (!profile) break

          const priceId = subscription.items.data[0]?.price.id
          const tier = planMapping[priceId] || 'starter'

          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: subscription.status as 'active' | 'inactive' | 'trialing' | 'cancelled',
            })
            .eq('id', profile.id)
        } else {
          const priceId = subscription.items.data[0]?.price.id
          const tier = planMapping[priceId] || 'starter'

          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: subscription.status as 'active' | 'inactive' | 'trialing' | 'cancelled',
            })
            .eq('id', userId)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single()

        if (!profile) break

        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'cancelled',
            stripe_subscription_id: null,
          })
          .eq('id', profile.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'inactive' })
          .eq('id', profile.id)

        break
      }
    }
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

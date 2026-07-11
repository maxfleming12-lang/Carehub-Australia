import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { requireUser } from '@/lib/auth'
import { BillingPortalButton } from '@/components/billing/portal-button'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your Scribe & Thrive Australia subscription.',
}

function formatPlan(value: string | null) {
  if (!value) return 'Free'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const tierDetails: Record<string, { color: string; description: string }> = {
  free: { color: 'bg-gray-100 text-gray-700', description: 'Basic access to platform tools' },
  starter: { color: 'bg-blue-100 text-blue-700', description: 'Resources, 5 AI docs/month, 10 shift notes/month' },
  professional: { color: 'bg-teal-100 text-teal-700', description: 'Unlimited shift notes, 50 AI docs/month, all courses' },
  enterprise: { color: 'bg-purple-100 text-purple-700', description: 'Unlimited everything, dedicated support' },
}

export default async function BillingPage() {
  const { profile } = await requireUser('/dashboard/billing')
  const tier = profile.subscription_tier || 'free'
  const tierInfo = tierDetails[tier] || tierDetails.free
  const hasStripeSubscription = Boolean(profile.https:acct_1ToM6fI1HEYYRDvo)

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal-600" />
            Billing & Subscription
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your plan and payment details.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Current Plan */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Current Plan</h2>
                <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
              </div>
              <Badge className={tierInfo.color}>
                {formatPlan(tier)}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-xs text-gray-500 mb-1">Plan</div>
                <div className="font-semibold text-gray-900">{formatPlan(tier)}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className="font-semibold text-gray-900 capitalize">
                  {profile.subscription_status || 'Inactive'}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-xs text-gray-500 mb-1">Includes</div>
                <div className="text-sm text-gray-700">{tierInfo.description}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {hasStripeSubscription ? (
                <BillingPortalButton />
              ) : (
                <Link href="/pricing">
                  <Button variant="primary">Upgrade Plan</Button>
                </Link>
              )}
              <Link href="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA for free users */}
        {tier === 'free' && (
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-teal-900 mb-2">Unlock More with a Paid Plan</h3>
              <p className="text-sm text-teal-800 mb-4">
                Upgrade to access the full resource library, unlimited shift notes, all training courses, and more AI document generations per month.
              </p>
              <Link href="/pricing">
                <Button variant="primary" size="sm">View Plans & Pricing</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Billing info note */}
        {hasStripeSubscription && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Payment & Invoices</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your payment method, download invoices, and update billing details through the Stripe Customer Portal.
              </p>
              <BillingPortalButton label="Open Billing Portal" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

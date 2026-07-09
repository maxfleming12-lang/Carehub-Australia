import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { requireUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your Scribe & Thrive Australia subscription.',
}

function formatPlan(value: string | null) {
  if (!value) {
    return 'Free'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default async function BillingPage() {
  const { profile } = await requireUser('/dashboard/billing')

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
            Billing
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your current plan and subscription status.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-gray-900">Current Plan</h2>
                <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
              </div>
              <Badge className="bg-teal-100 text-teal-700">
                {formatPlan(profile.subscription_tier)}
              </Badge>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-gray-500">Subscription status</div>
                <div className="font-semibold text-gray-900 mt-1">{profile.subscription_status || 'inactive'}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-gray-500">Account role</div>
                <div className="font-semibold text-gray-900 mt-1">{profile.role}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/pricing">
                <Button variant="primary">View Plans</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

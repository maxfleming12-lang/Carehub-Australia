import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BarChart3, FileText, StickyNote, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { requireAdmin } from '@/lib/admin'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Analytics · Admin',
  description: 'Live Scribe & Thrive Australia platform analytics.',
}

function formatCount(value: number | null | undefined) {
  return (value ?? 0).toLocaleString('en-AU')
}

export default async function AdminAnalyticsPage() {
  await requireAdmin()
  const supabase = createSupabaseAdminClient()

  const [users, documents, shiftNotes, activeSubscriptions] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('generated_documents').select('id', { count: 'exact', head: true }),
    supabase.from('shift_notes').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).in('subscription_status', ['active', 'trialing']),
  ])

  const metrics = [
    { label: 'Users', value: formatCount(users.count), icon: Users },
    { label: 'Active or Trialing Subscriptions', value: formatCount(activeSubscriptions.count), icon: BarChart3 },
    { label: 'Generated Documents', value: formatCount(documents.count), icon: FileText },
    { label: 'Shift Notes', value: formatCount(shiftNotes.count), icon: StickyNote },
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs mb-2">Admin Access</Badge>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-400 text-sm">Live counts from Supabase</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-5">
                <metric.icon className="h-5 w-5 text-teal-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

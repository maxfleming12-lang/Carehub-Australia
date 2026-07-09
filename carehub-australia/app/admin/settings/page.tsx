import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Settings, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { requireAdmin } from '@/lib/admin'

export const metadata: Metadata = {
  title: 'Settings · Admin',
  description: 'Scribe & Thrive Australia admin settings.',
}

const checks = [
  { label: 'Supabase URL', configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
  { label: 'Supabase publishable key', configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
  { label: 'Supabase service role key', configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
  { label: 'Stripe secret key', configured: Boolean(process.env.STRIPE_SECRET_KEY) },
  { label: 'OpenAI API key', configured: Boolean(process.env.OPENAI_API_KEY) },
]

export default async function AdminSettingsPage() {
  const { profile } = await requireAdmin()

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs mb-2">Admin Access</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-400" />
            Settings
          </h1>
          <p className="text-gray-400 text-sm">Environment and account checks</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="font-bold text-gray-900 mb-2">Current Admin</h2>
            <div className="text-sm text-gray-600">{profile.full_name || profile.email}</div>
            <div className="text-xs text-gray-400">{profile.email}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold text-gray-900 mb-4">Configuration</h2>
            <div className="space-y-3">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <span className="text-sm text-gray-700">{check.label}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${check.configured ? 'text-green-700' : 'text-amber-700'}`}>
                    {check.configured ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {check.configured ? 'Configured' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

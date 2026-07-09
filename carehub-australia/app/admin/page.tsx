import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { requireAdmin } from '@/lib/admin'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Scribe & Thrive Australia administration dashboard.',
}

const adminNav = [
  { label: 'User Management', href: '/admin/users', icon: Users, desc: 'View accounts and subscription status' },
  { label: 'Content Overview', href: '/admin/content', icon: BookOpen, desc: 'Review resources, courses, and posts' },
  { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp, desc: 'Live platform usage counts' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Environment and platform checks' },
]

const tiers = ['free', 'starter', 'professional', 'enterprise'] as const

function formatCount(value: number | null | undefined) {
  return (value ?? 0).toLocaleString('en-AU')
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default async function AdminDashboard() {
  const { profile } = await requireAdmin()
  const supabase = createSupabaseAdminClient()

  const [
    totalUsersResult,
    activeSubscriptionsResult,
    documentCountResult,
    shiftNoteCountResult,
    recentUsersResult,
    ...tierCountResults
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).in('subscription_status', ['active', 'trialing']),
    supabase.from('generated_documents').select('id', { count: 'exact', head: true }),
    supabase.from('shift_notes').select('id', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id, full_name, email, role, subscription_tier, subscription_status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    ...tiers.map((tier) =>
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_tier', tier)
    ),
  ])

  const totalUsers = totalUsersResult.count ?? 0
  const planDistribution = tiers.map((tier, index) => {
    const count = tierCountResults[index]?.count ?? 0
    const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
    return { tier, count, percentage }
  })

  const adminStats = [
    { label: 'Total Users', value: formatCount(totalUsersResult.count), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Subscriptions', value: formatCount(activeSubscriptionsResult.count), icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Documents Generated', value: formatCount(documentCountResult.count), icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Shift Notes Created', value: formatCount(shiftNoteCountResult.count), icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  const systemChecks = [
    { service: 'Database', status: totalUsersResult.error ? 'Error' : 'Connected', ok: !totalUsersResult.error },
    { service: 'Supabase Auth', status: 'Admin verified', ok: true },
    { service: 'Stripe', status: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing env var', ok: Boolean(process.env.STRIPE_SECRET_KEY) },
    { service: 'OpenAI', status: process.env.OPENAI_API_KEY ? 'Configured' : 'Missing env var', ok: Boolean(process.env.OPENAI_API_KEY) },
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Admin Access</Badge>
              </div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Live platform overview</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <div className="text-white font-medium">{profile.full_name || profile.email}</div>
              <div>Administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-gray-900 mb-4">Admin Navigation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {adminNav.map((item) => (
                    <Link key={item.label} href={item.href}>
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-teal-500 hover:bg-teal-50 transition-all group cursor-pointer">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                          <item.icon className="h-5 w-5 text-gray-500 group-hover:text-teal-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-teal-500 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900">Recent Registrations</h2>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="text-xs text-teal-600">
                      View all users
                    </Button>
                  </Link>
                </div>
                {!recentUsersResult.data || recentUsersResult.data.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                    No user registrations found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentUsersResult.data.map((user) => {
                      const name = user.full_name || user.email
                      return (
                        <div key={user.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initialsFor(name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{name}</div>
                            <div className="text-xs text-gray-400 truncate">{user.email}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-xs">{user.subscription_tier || 'free'}</Badge>
                            <Badge className={`text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                              {user.role}
                            </Badge>
                            <span className="text-xs text-gray-400">{formatDate(user.created_at)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-4">Plan Distribution</h3>
                <div className="space-y-3">
                  {planDistribution.map((item) => (
                    <div key={item.tier}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-700 capitalize">{item.tier}</span>
                        <span className="text-gray-500">{item.count.toLocaleString('en-AU')} ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-4">System Checks</h3>
                <div className="space-y-2">
                  {systemChecks.map((item) => (
                    <div key={item.service} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.service}</span>
                      <div className={`flex items-center gap-1 ${item.ok ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className={`h-2 w-2 rounded-full ${item.ok ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className="text-xs">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Admin Scope</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This account has server-verified admin access through the `profiles.role` field. User records are visible for support and subscription administration only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

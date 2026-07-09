import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Award,
  Bell,
  BookOpen,
  Brain,
  Clock,
  Download,
  FileText,
  HeartPulse,
  Plus,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your Scribe & Thrive Australia member dashboard.',
}

const quickActions = [
  { icon: FileText, label: 'New Shift Note', href: '/shift-notes', color: 'bg-teal-500' },
  { icon: Brain, label: 'Generate Document', href: '/ai-document-builder', color: 'bg-purple-500' },
  { icon: BookOpen, label: 'Browse Training', href: '/training', color: 'bg-blue-500' },
  { icon: Download, label: 'Open Resources', href: '/resources', color: 'bg-green-500' },
]

function formatCount(value: number | null | undefined) {
  return String(value ?? 0)
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Date unavailable'
  }

  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getPlanLabel(tier: string | null, role: string) {
  if (role === 'admin') {
    return 'Admin'
  }

  if (!tier) {
    return 'Free'
  }

  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

export default async function DashboardPage() {
  const { user, profile } = await requireUser('/dashboard')
  const supabase = await createSupabaseServerClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    documentCountResult,
    monthlyDocumentResult,
    shiftNoteCountResult,
    monthlyShiftNoteResult,
    completedCourseResult,
    activeCourseResult,
    recentDocumentsResult,
    recentShiftNotesResult,
    latestBurnoutResult,
  ] = await Promise.all([
    supabase.from('generated_documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('generated_documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', startOfMonth.toISOString()),
    supabase.from('shift_notes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('shift_notes').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', startOfMonth.toISOString()),
    supabase.from('course_enrollments').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true),
    supabase.from('course_enrollments').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', false),
    supabase.from('generated_documents').select('title, type, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(4),
    supabase.from('shift_notes').select('client_name, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(4),
    supabase.from('assessments').select('created_at, level').eq('user_id', user.id).eq('type', 'burnout').order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const displayName = profile.full_name || profile.email || user.email || 'there'
  const planLabel = getPlanLabel(profile.subscription_tier, profile.role)
  const initials = getInitials(displayName)
  const recentActivity = [
    ...(recentDocumentsResult.data ?? []).map((item) => ({
      title: item.title,
      detail: item.type.replace(/_/g, ' '),
      createdAt: item.created_at,
      time: formatDate(item.created_at),
      icon: Brain,
    })),
    ...(recentShiftNotesResult.data ?? []).map((item) => ({
      title: `Shift note for ${item.client_name}`,
      detail: 'shift note',
      createdAt: item.created_at,
      time: formatDate(item.created_at),
      icon: FileText,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: 'Documents Generated',
      value: formatCount(documentCountResult.count),
      detail: `${formatCount(monthlyDocumentResult.count)} this month`,
      color: 'text-purple-600',
    },
    {
      label: 'Shift Notes Created',
      value: formatCount(shiftNoteCountResult.count),
      detail: `${formatCount(monthlyShiftNoteResult.count)} this month`,
      color: 'text-teal-600',
    },
    {
      label: 'Courses Completed',
      value: formatCount(completedCourseResult.count),
      detail: `${formatCount(activeCourseResult.count)} in progress`,
      color: 'text-blue-600',
    },
    {
      label: 'Burnout Checks',
      value: latestBurnoutResult.data ? '1' : '0',
      detail: latestBurnoutResult.data
        ? `${latestBurnoutResult.data.level} risk on ${formatDate(latestBurnoutResult.data.created_at)}`
        : 'none recorded yet',
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {displayName}</h1>
              <p className="text-gray-500 text-sm mt-0.5">Your live Scribe & Thrive workspace</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <Badge className="bg-teal-100 text-teal-700">{planLabel} Plan</Badge>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {initials || 'ST'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className="hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-5 text-center">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">{action.label}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.detail}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900">Recent Activity</h2>
                </div>
                {recentActivity.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-700">No activity yet</p>
                    <p className="text-sm text-gray-400 mt-1">Generated documents and shift notes will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div key={`${item.title}-${item.time}`} className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {item.detail} · {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Start a Shift Note</h2>
                  <Link href="/shift-notes">
                    <Button variant="primary" size="sm">
                      <Plus className="h-4 w-4" />
                      New Note
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  Create a shift note from your own client and shift details. No pre-filled client records are stored here.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Account</h3>
                  <Badge className="bg-teal-100 text-teal-700">{planLabel}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-700">{profile.email || user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-gray-700">{profile.subscription_status || 'inactive'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-gray-700">{profile.role}</span>
                  </div>
                </div>
                <Link href="/dashboard/billing" className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage Subscription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Training</h3>
                  <Link href="/training" className="text-xs text-teal-600 hover:underline">
                    Browse
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <Award className="h-4 w-4 text-blue-600 mb-2" />
                    <div className="text-xl font-bold text-blue-700">{formatCount(completedCourseResult.count)}</div>
                    <div className="text-xs text-blue-700">completed</div>
                  </div>
                  <div className="rounded-lg bg-teal-50 p-3">
                    <BookOpen className="h-4 w-4 text-teal-600 mb-2" />
                    <div className="text-xl font-bold text-teal-700">{formatCount(activeCourseResult.count)}</div>
                    <div className="text-xs text-teal-700">in progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="h-4 w-4 text-orange-700" />
                  <h3 className="font-bold text-orange-900 text-sm">Wellbeing Check</h3>
                </div>
                <p className="text-xs text-orange-700 mb-3 leading-relaxed">
                  {latestBurnoutResult.data
                    ? `Last burnout assessment: ${formatDate(latestBurnoutResult.data.created_at)} (${latestBurnoutResult.data.level} risk).`
                    : 'No burnout assessment has been recorded on your account yet.'}
                </p>
                <Link href="/assessments/burnout">
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs">
                    Take Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

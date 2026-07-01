import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  Brain,
  BookOpen,
  Download,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  Plus,
  Bell,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your Scribe & Thrive Australia member dashboard.',
}

const quickActions = [
  { icon: FileText, label: 'New Shift Note', href: '/shift-notes', color: 'bg-teal-500' },
  { icon: Brain, label: 'Generate Document', href: '/ai-document-builder', color: 'bg-purple-500' },
  { icon: BookOpen, label: 'Continue Course', href: '/training', color: 'bg-blue-500' },
  { icon: Download, label: 'Download Resource', href: '/resources', color: 'bg-green-500' },
]

const recentActivity = [
  { type: 'shift_note', title: 'Shift note for Michael B.', time: '2 hours ago', icon: FileText },
  { type: 'document', title: 'Care plan generated for Sarah T.', time: 'Yesterday', icon: Brain },
  { type: 'course', title: 'Completed: NDIS Fundamentals', time: '3 days ago', icon: Award },
  { type: 'download', title: 'Downloaded: Incident Report Template', time: '1 week ago', icon: Download },
]

const stats = [
  { label: 'Documents Generated', value: '24', trend: '+8 this month', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Shift Notes Created', value: '67', trend: '+12 this month', color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Courses Completed', value: '3/18', trend: '1 in progress', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Resources Downloaded', value: '15', trend: '+3 this month', color: 'text-green-600', bg: 'bg-green-50' },
]

const coursesInProgress = [
  { title: 'Mental Health First Aid', progress: 65, modules: '6/10 modules' },
  { title: 'Medication Administration', progress: 20, modules: '1/7 modules' },
]

export default function DashboardPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Good morning, Jane! 👋</h1>
              <p className="text-gray-500 text-sm mt-0.5">Here&apos;s your Scribe & Thrive overview</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              <Badge className="bg-teal-100 text-teal-700">Professional Plan</Badge>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                JS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick actions */}
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

        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900">Recent Activity</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-teal-600">
                    View all
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick shift note */}
            <Card className="mt-6">
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
                <p className="text-sm text-gray-500 mb-4">
                  Quickly generate a professional shift note using our AI assistant.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {['Sarah T.', 'Michael B.', 'Robert L.'].map((client) => (
                    <Link key={client} href="/shift-notes">
                      <button className="w-full rounded-lg border border-gray-200 py-2 px-3 text-xs font-medium text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors">
                        {client}
                      </button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Subscription */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Your Plan</h3>
                  <Badge className="bg-teal-100 text-teal-700">Professional</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">AI Documents</span>
                    <span className="font-medium text-gray-700">24 / 50 used</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '48%' }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Shift Notes</span>
                    <span className="font-medium text-gray-700">67 / ∞</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full w-1/3" />
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Plan renews on 27 July 2026
                </div>
                <Link href="/dashboard/billing" className="mt-3 block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage Subscription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Courses in progress */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Training Progress</h3>
                  <Link href="/training" className="text-xs text-teal-600 hover:underline">
                    See all
                  </Link>
                </div>
                <div className="space-y-4">
                  {coursesInProgress.map((course) => (
                    <div key={course.title}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-gray-700 leading-tight">{course.title}</span>
                        <span className="text-gray-400">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{course.modules}</div>
                    </div>
                  ))}
                </div>
                <Link href="/training" className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Continue Learning
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Burnout check */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-5">
                <h3 className="font-bold text-orange-900 text-sm mb-2">Time for a Wellbeing Check?</h3>
                <p className="text-xs text-orange-700 mb-3 leading-relaxed">
                  It&apos;s been 30 days since your last burnout assessment. Regular checks help you stay on top of your wellbeing.
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, FileText, TrendingUp, DollarSign, Activity, ArrowRight, Settings, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { requireAdmin } from '@/lib/admin'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Scribe & Thrive Australia administration dashboard.',
}

const adminStats = [
  { label: 'Total Users', value: '12,847', trend: '+247 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Monthly Revenue', value: '$48,230', trend: '+12% vs last month', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Docs Generated', value: '8,420', trend: '+1,203 this month', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Active Subscriptions', value: '2,341', trend: '+89 this month', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
]

const recentUsers = [
  { name: 'Sarah Mitchell', email: 'sarah.m@support.com.au', plan: 'Professional', joined: '2 hours ago', status: 'active' },
  { name: 'James Nguyen', email: 'jnguyen@careorg.com.au', plan: 'Starter', joined: '5 hours ago', status: 'trial' },
  { name: 'Rebecca Torres', email: 'rtorres@healthcare.au', plan: 'Enterprise', joined: 'Yesterday', status: 'active' },
  { name: 'Mark Wilson', email: 'mwilson@ndis.net.au', plan: 'Starter', joined: 'Yesterday', status: 'active' },
  { name: 'Emma Chen', email: 'echen@agedcare.com.au', plan: 'Professional', joined: '2 days ago', status: 'active' },
]

const planDistribution = [
  { plan: 'Free', count: 8940, percentage: 70, color: 'bg-gray-400' },
  { plan: 'Starter', count: 2100, percentage: 16, color: 'bg-blue-500' },
  { plan: 'Professional', count: 1500, percentage: 12, color: 'bg-teal-500' },
  { plan: 'Enterprise', count: 307, percentage: 2, color: 'bg-purple-500' },
]

const adminNav = [
  { label: 'User Management', href: '/admin/users', icon: Users, desc: 'Manage accounts, subscriptions' },
  { label: 'Content Management', href: '/admin/content', icon: BookOpen, desc: 'Blog posts, resources, courses' },
  { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp, desc: 'Revenue, usage, growth metrics' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Platform configuration' },
]

export default async function AdminDashboard() {
  const { profile } = await requireAdmin()

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Admin Access</Badge>
              </div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Scribe & Thrive Australia · Platform Overview</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <div className="text-white font-medium">{profile.full_name || profile.email}</div>
              <div>Administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600">{stat.trend}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Admin navigation */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-gray-900 mb-4">Admin Navigation</h2>
                <div className="grid grid-cols-2 gap-3">
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

            {/* Recent users */}
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
                <div className="space-y-3">
                  {recentUsers.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">{user.plan}</Badge>
                        <Badge
                          className={`text-xs ${user.status === 'trial' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                        >
                          {user.status}
                        </Badge>
                        <span className="text-xs text-gray-400">{user.joined}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Plan distribution */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-4">Plan Distribution</h3>
                <div className="space-y-3">
                  {planDistribution.map((item) => (
                    <div key={item.plan}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-700">{item.plan}</span>
                        <span className="text-gray-500">{item.count.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue breakdown */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Starter', revenue: '$60,900/mo', color: 'text-blue-600' },
                    { label: 'Professional', revenue: '$118,500/mo', color: 'text-teal-600' },
                    { label: 'Enterprise', revenue: '$61,093/mo', color: 'text-purple-600' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.label} Plan</span>
                      <span className={`font-semibold ${item.color}`}>{item.revenue}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                    <span className="font-semibold text-gray-900">Total MRR</span>
                    <span className="font-bold text-gray-900">$240,493</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System status */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-2">
                  {[
                    { service: 'API Server', status: 'Operational', ok: true },
                    { service: 'Database', status: 'Operational', ok: true },
                    { service: 'Stripe Payments', status: 'Operational', ok: true },
                    { service: 'OpenAI API', status: 'Operational', ok: true },
                    { service: 'File Storage', status: 'Operational', ok: true },
                  ].map((item) => (
                    <div key={item.service} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.service}</span>
                      <div className={`flex items-center gap-1 ${item.ok ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`h-2 w-2 rounded-full ${item.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

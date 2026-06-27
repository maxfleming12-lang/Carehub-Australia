import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, ArrowLeft, Search, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { requireAdmin } from '@/lib/admin'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import UserSearchBar from './UserSearchBar'

export const metadata: Metadata = {
  title: 'User Management · Admin',
  description: 'View and manage CareHub Australia user accounts.',
}

const tierColour: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  starter: 'bg-blue-100 text-blue-700',
  professional: 'bg-teal-100 text-teal-700',
  enterprise: 'bg-purple-100 text-purple-700',
}

const statusColour: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  trialing: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
}

type PageProps = {
  searchParams: Promise<{ search?: string; tier?: string; status?: string }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  await requireAdmin()

  const { search = '', tier = '', status = '' } = await searchParams

  const supabase = createSupabaseAdminClient()

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, organization, role, subscription_tier, subscription_status, state, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,organization.ilike.%${search}%`)
  }
  if (tier) {
    query = query.eq('subscription_tier', tier as 'free' | 'starter' | 'professional' | 'enterprise')
  }
  if (status) {
    query = query.eq('subscription_status', status as 'active' | 'inactive' | 'trialing' | 'cancelled')
  }

  const { data: users, error } = await query

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </button>
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Admin Access</Badge>
                </div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6 text-gray-400" />
                  User Management
                </h1>
                <p className="text-gray-400 text-sm">
                  View account details · {users?.length ?? 0} results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Notice */}
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Privacy notice:</strong> You can view account and subscription details for support purposes.
            User notes, AI-generated documents, assessments, and shift records are not accessible from this panel.
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <UserSearchBar defaultSearch={search} defaultTier={tier} defaultStatus={status} />
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {error ? (
              <div className="p-8 text-center text-red-600 text-sm">
                Failed to load users. Check your Supabase configuration.
              </div>
            ) : !users || users.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-600">No users found</p>
                {search && <p className="text-sm mt-1">Try a different search term or clear the filters.</p>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Organisation</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Plan</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">State</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Joined</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const initials = (user.full_name || user.email)
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                      const joined = user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'

                      return (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.full_name || '—'}</div>
                                <div className="text-xs text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.organization || '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tierColour[user.subscription_tier || 'free'] || tierColour.free}`}>
                              {user.subscription_tier || 'free'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.subscription_status ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColour[user.subscription_status] || 'bg-gray-100 text-gray-500'}`}>
                                {user.subscription_status}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.state || '—'}</td>
                          <td className="px-6 py-4 text-gray-500 text-xs">{joined}</td>
                          <td className="px-6 py-4">
                            {user.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <Shield className="h-3 w-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">User</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Trash2, Edit2, Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { deleteResource } from './actions'

export const metadata: Metadata = {
  title: 'Admin Resources',
  description: 'Manage published resources for users',
}

export default async function AdminResourcesPage() {
  const supabase = await createSupabaseServerClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 flex gap-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-red-900">Access Denied</h2>
                <p className="text-sm text-red-700 mt-1">You do not have permission to access this page.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: resources, error } = await supabase
    .from('resources')
    .select('id, title, description, category, access_tier, is_published, created_at, download_count')
    .order('created_at', { ascending: false })

  const tierColors: Record<string, string> = {
    free: 'bg-green-100 text-green-800',
    starter: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            <p className="text-gray-600 mt-1">Create, edit, and publish resources for users</p>
          </div>
          <Link href="/admin/resources/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Resource
            </Button>
          </Link>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 flex gap-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-red-900">Error loading resources</h2>
                <p className="text-sm text-red-700 mt-1">Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : !resources || resources.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No resources yet</h2>
              <p className="text-gray-600 mb-6">Create your first resource to get started</p>
              <Link href="/admin/resources/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resource
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-sm text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm text-gray-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm text-gray-700">Access Tier</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm text-gray-700">Downloads</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{resource.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(resource.created_at).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{resource.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={tierColors[resource.access_tier]}>
                        {resource.access_tier}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {resource.is_published ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">Draft</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {resource.download_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/resources/${resource.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form
                          action={async () => {
                            'use server'
                            await deleteResource(resource.id)
                          }}
                          onSubmit={(e) => {
                            if (!confirm('Are you sure? This cannot be undone.')) {
                              e.preventDefault()
                            }
                          }}
                        >
                          <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

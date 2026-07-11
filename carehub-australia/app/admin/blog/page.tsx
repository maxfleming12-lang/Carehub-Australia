import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { requireAdmin } from '@/lib/admin'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { deleteBlogPost } from './actions'

export const metadata: Metadata = { title: 'Blog Management · Admin' }

export default async function AdminBlogPage() {
  await requireAdmin()
  const supabase = createSupabaseAdminClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, is_published, created_at, view_count, tags')
    .order('created_at', { ascending: false })

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/content" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4">
            <ArrowLeft className="h-4 w-4" /> Content
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs mb-2">Admin</Badge>
              <h1 className="text-2xl font-bold">Blog Management</h1>
              <p className="text-gray-400 text-sm">{posts?.length ?? 0} posts total</p>
            </div>
            <Link href="/admin/blog/new">
              <Button variant="primary"><Plus className="h-4 w-4 mr-2" />New Post</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!posts || posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h2>
              <p className="text-gray-500 mb-6">Create your first post to get started.</p>
              <Link href="/admin/blog/new">
                <Button><Plus className="h-4 w-4 mr-2" />Create Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Views</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="flex gap-1 mt-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{post.slug}</td>
                      <td className="px-6 py-4">
                        {post.is_published
                          ? <Badge className="bg-green-100 text-green-800"><Eye className="h-3 w-3 mr-1" />Published</Badge>
                          : <Badge variant="outline" className="text-gray-500"><EyeOff className="h-3 w-3 mr-1" />Draft</Badge>}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{post.view_count}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(post.created_at).toLocaleDateString('en-AU')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/blog/${post.id}/edit`}>
                            <Button variant="ghost" size="sm"><Edit2 className="h-4 w-4" /></Button>
                          </Link>
                          <form action={async () => { 'use server'; await deleteBlogPost(post.id) }}>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

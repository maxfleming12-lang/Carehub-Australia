import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { requireAdmin } from '@/lib/admin'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Content · Admin',
  description: 'Scribe & Thrive Australia content overview.',
}

function formatCount(value: number | null | undefined) {
  return (value ?? 0).toLocaleString('en-AU')
}

export default async function AdminContentPage() {
  await requireAdmin()
  const supabase = createSupabaseAdminClient()

  const [resources, courses, posts] = await Promise.all([
    supabase.from('resources').select('id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
  ])

  const sections = [
    { label: 'Resources', value: formatCount(resources.count), icon: FileText },
    { label: 'Courses', value: formatCount(courses.count), icon: GraduationCap },
    { label: 'Blog Posts', value: formatCount(posts.count), icon: BookOpen },
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
          <h1 className="text-2xl font-bold">Content Overview</h1>
          <p className="text-gray-400 text-sm">Published content counts from Supabase</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Card key={section.label}>
              <CardContent className="p-5">
                <section.icon className="h-5 w-5 text-teal-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">{section.value}</div>
                <div className="text-sm text-gray-500">{section.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

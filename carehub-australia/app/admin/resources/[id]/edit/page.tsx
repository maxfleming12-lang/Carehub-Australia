import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ResourceForm } from '@/components/admin/resource-form'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updateResource } from '../../actions'

type EditResourcePageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditResourcePageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit Resource - ${id}`,
    description: 'Edit resource details',
  }
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = await params
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
    notFound()
  }

  const { data: resource } = await supabase
    .from('resources')
    .select('id, title, description, content, file_url, category, tags, access_tier, is_published')
    .eq('id', id)
    .maybeSingle()

  if (!resource) {
    notFound()
  }

  const handleUpdate = async (data: any) => {
    'use server'
    await updateResource(id, data)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
          <p className="text-gray-600 mt-2">{resource.title}</p>
        </div>

        <ResourceForm
          initialData={{
            id: resource.id,
            title: resource.title,
            description: resource.description,
            content: resource.content || '',
            file_url: resource.file_url || '',
            category: resource.category as 'NDIS' | 'Aged Care' | 'Templates' | 'Guides',
            tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : '',
            access_tier: resource.access_tier as 'free' | 'starter' | 'professional' | 'enterprise',
            is_published: resource.is_published,
          }}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  )
}

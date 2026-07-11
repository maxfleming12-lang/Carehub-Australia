'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

type ResourceData = {
  title: string
  description: string
  content?: string
  file_url?: string
  category: 'NDIS' | 'Aged Care' | 'Templates' | 'Guides'
  tags: string
  access_tier: 'free' | 'starter' | 'professional' | 'enterprise'
  is_published: boolean
}

export async function createResource(data: ResourceData) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  if (!user || profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('resources').insert({
    title: data.title,
    description: data.description,
    content: data.content || null,
    file_url: data.file_url || null,
    category: data.category,
    tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
    access_tier: data.access_tier,
    is_published: data.is_published,
    download_count: 0,
  })

  if (error) {
    throw new Error(`Failed to create resource: ${error.message}`)
  }
}

export async function updateResource(id: string, data: ResourceData) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  if (!user || profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('resources')
    .update({
      title: data.title,
      description: data.description,
      content: data.content || null,
      file_url: data.file_url || null,
      category: data.category,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      access_tier: data.access_tier,
      is_published: data.is_published,
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update resource: ${error.message}`)
  }
}

export async function deleteResource(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  if (!user || profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('resources').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete resource: ${error.message}`)
  }
}

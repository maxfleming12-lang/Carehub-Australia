'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

type BlogPostData = {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string
  is_published: boolean
  seo_title?: string
  seo_description?: string
}

async function requireAdminSupabase() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    : { data: null }
  if (!user || profile?.role !== 'admin') throw new Error('Unauthorized')
  return { supabase, user }
}

export async function createBlogPost(data: BlogPostData) {
  const { supabase, user } = await requireAdminSupabase()

  const { error } = await supabase.from('blog_posts').insert({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
    is_published: data.is_published,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    author_id: user.id,
    view_count: 0,
  })

  if (error) throw new Error(`Failed to create post: ${error.message}`)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}

export async function updateBlogPost(id: string, data: BlogPostData) {
  const { supabase } = await requireAdminSupabase()

  const { error } = await supabase.from('blog_posts').update({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
    is_published: data.is_published,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
  }).eq('id', id)

  if (error) throw new Error(`Failed to update post: ${error.message}`)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}

export async function deleteBlogPost(id: string) {
  const { supabase } = await requireAdminSupabase()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete post: ${error.message}`)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}

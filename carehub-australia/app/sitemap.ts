import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL as BASE_URL } from '@/lib/site-url'

// Marketing pages, ordered roughly by importance.
const STATIC_PATHS: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/pricing', priority: 0.9 },
  { path: '/training', priority: 0.9 },
  { path: '/resources', priority: 0.9 },
  { path: '/ai-document-builder', priority: 0.8 },
  { path: '/shift-notes', priority: 0.8 },
  { path: '/assessments', priority: 0.8 },
  { path: '/assessments/burnout', priority: 0.7 },
  { path: '/about', priority: 0.6 },
  { path: '/blog', priority: 0.6 },
  { path: '/contact', priority: 0.6 },
  { path: '/ndis', priority: 0.5 },
  { path: '/help', priority: 0.5 },
  { path: '/community', priority: 0.4 },
  { path: '/careers', priority: 0.4 },
  { path: '/status', priority: 0.3 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
  { path: '/cookies', priority: 0.3 },
  { path: '/accessibility', priority: 0.3 },
]

async function getPublishedCourseIds(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    return []
  }

  try {
    const supabase = createClient(url, key)
    const { data } = await supabase
      .from('courses')
      .select('id')
      .eq('is_published', true)

    return (data ?? []).map((course) => course.id)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courseIds = await getPublishedCourseIds()

  return [
    ...STATIC_PATHS.map(({ path, priority }) => ({
      url: `${BASE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...courseIds.map((id) => ({
      url: `${BASE_URL}/training/${id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { createSupabaseServerClient } from '@/lib/supabase-server'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

async function getPost(slug: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, content, tags, created_at, seo_title, seo_description')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  return data
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <div className="mb-6 text-sm text-gray-500">{formatDate(post.created_at)}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  )
}

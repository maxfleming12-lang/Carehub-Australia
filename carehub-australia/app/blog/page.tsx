import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Scribe & Thrive Australia care sector updates and resources.',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient()
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, tags, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Scribe & Thrive Updates
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Published articles and platform updates will appear here.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <Card>
              <CardContent className="p-10 text-center text-red-600 text-sm">
                Blog posts could not be loaded. Please try again later.
              </CardContent>
            </Card>
          ) : !posts || posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">No posts published yet</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Admin-published articles will be listed here once they are available.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.slug} className="h-full card-hover">
                  <CardContent className="p-6 flex h-full flex-col">
                    <div className="text-xs text-gray-400 mb-3">{formatDate(post.created_at)}</div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                      Read post
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles, guides, and insights for Australian care workers and organisations. NDIS updates, best practices, and carer wellbeing tips.',
}

const posts = [
  {
    slug: 'ndis-documentation-best-practices-2024',
    title: 'NDIS Documentation Best Practices: A Complete Guide for 2026',
    excerpt:
      "Comprehensive documentation is the backbone of quality NDIS support. In this guide, we cover everything you need to know about keeping compliant, person-centred records that demonstrate outcome achievement.",
    category: 'NDIS',
    readTime: '8 min read',
    date: '20 June 2026',
    author: 'Dr. Sarah Chen',
    authorRole: 'NDIS Compliance Expert',
    featured: true,
    image: '📋',
  },
  {
    slug: 'carer-burnout-warning-signs',
    title: 'The 10 Warning Signs of Carer Burnout You Shouldn\'t Ignore',
    excerpt:
      'Burnout in the care sector is at an all-time high. Learn to recognise the early warning signs and take action before it affects your health and the quality of care you provide.',
    category: 'Wellbeing',
    readTime: '6 min read',
    date: '15 June 2026',
    author: 'Emma Rodriguez',
    authorRole: 'Mental Health Practitioner',
    featured: false,
    image: '❤️',
  },
  {
    slug: 'aged-care-quality-standards-explained',
    title: 'Australia\'s 8 Aged Care Quality Standards: What They Really Mean for Workers',
    excerpt:
      "The Aged Care Quality Standards came into effect in 2019, but many workers still struggle to understand their practical implications. We break down each standard with real-world examples.",
    category: 'Aged Care',
    readTime: '10 min read',
    date: '8 June 2026',
    author: 'James Thompson',
    authorRole: 'Aged Care Consultant',
    featured: false,
    image: '🏠',
  },
  {
    slug: 'ai-tools-disability-support',
    title: 'How AI Is Transforming Disability Support Documentation in Australia',
    excerpt:
      'Artificial intelligence is revolutionising how care workers create documentation. We explore practical applications, limitations, and compliance considerations for AI-generated care documents.',
    category: 'Technology',
    readTime: '7 min read',
    date: '1 June 2026',
    author: 'Scribe & Thrive Team',
    authorRole: 'Scribe & Thrive Australia',
    featured: false,
    image: '🤖',
  },
  {
    slug: 'positive-behaviour-support-basics',
    title: 'Positive Behaviour Support: A Practical Guide for NDIS Support Workers',
    excerpt:
      'Understanding and implementing positive behaviour support strategies is a key skill for NDIS support workers. This guide provides practical, evidence-based strategies you can apply immediately.',
    category: 'NDIS',
    readTime: '9 min read',
    date: '25 May 2026',
    author: 'Lisa Park',
    authorRole: 'Behaviour Support Practitioner',
    featured: false,
    image: '🧩',
  },
  {
    slug: 'self-care-strategies-carers',
    title: '15 Self-Care Strategies That Actually Work for Busy Carers',
    excerpt:
      "Self-care advice for carers often sounds good in theory but fails in practice. These 15 evidence-based strategies are designed specifically for the unique demands of care work.",
    category: 'Wellbeing',
    readTime: '5 min read',
    date: '18 May 2026',
    author: 'Michelle Davies',
    authorRole: 'Carer Support Specialist',
    featured: false,
    image: '🌱',
  },
]

const categories = ['All', 'NDIS', 'Aged Care', 'Wellbeing', 'Technology', 'Training', 'Policy']

const categoryColor: Record<string, string> = {
  NDIS: 'bg-teal-100 text-teal-700',
  'Aged Care': 'bg-blue-100 text-blue-700',
  Wellbeing: 'bg-red-100 text-red-700',
  Technology: 'bg-purple-100 text-purple-700',
  Training: 'bg-yellow-100 text-yellow-700',
  Policy: 'bg-orange-100 text-orange-700',
}

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured)
  const regularPosts = posts.filter((p) => !p.featured)

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Care Insights
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Scribe & Thrive Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Practical insights, NDIS updates, wellbeing strategies, and best practices for Australian care professionals.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  cat === 'All'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog content */}
      <section className="py-14 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Featured post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block mb-10">
              <Card className="overflow-hidden card-hover">
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-1" />
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${categoryColor[featuredPost.category] || 'bg-gray-100 text-gray-700'}`}>
                      {featuredPost.category}
                    </span>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="text-6xl hidden sm:block">{featuredPost.image}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-teal-600 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed mb-4">{featuredPost.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="font-medium text-gray-600">{featuredPost.author}</span>
                        <span>·</span>
                        <span>{featuredPost.date}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredPost.readTime}
                        </div>
                        <span className="flex items-center gap-1 text-teal-600 font-medium">
                          Read article <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full card-hover">
                  <CardContent className="p-5">
                    <div className="text-4xl mb-4">{post.image}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor[post.category] || 'bg-gray-100 text-gray-700'}`}>
                        {post.category}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 mb-2 leading-snug hover:text-teal-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div>
                        <div className="font-medium text-gray-600">{post.author}</div>
                        <div>{post.date}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-10">
            <button className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-teal-500 hover:text-teal-600 transition-colors">
              Load More Articles
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-3xl mb-3">📬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Informed</h2>
          <p className="text-gray-500 mb-6">
            Get the latest NDIS updates, care sector news, and practical tips delivered to your inbox weekly.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com.au"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-teal-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Tag className="h-4 w-4" />
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">
            Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>
    </div>
  )
}

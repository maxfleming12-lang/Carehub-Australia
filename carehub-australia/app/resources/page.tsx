import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clipboard,
  Download,
  FileText,
  Lock,
  Shield,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Download published resources for Australian care workers. Policy templates, checklists, guides and toolkits.',
}

type Resource = Pick<
  Database['public']['Tables']['resources']['Row'],
  | 'id'
  | 'created_at'
  | 'title'
  | 'description'
  | 'content'
  | 'file_url'
  | 'category'
  | 'tags'
  | 'access_tier'
  | 'download_count'
>

type ProfileAccess = {
  role: 'user' | 'admin'
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise' | null
} | null

const tierBadge: Record<Resource['access_tier'], { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-green-100 text-green-700' },
  starter: { label: 'Starter+', className: 'bg-blue-100 text-blue-700' },
  professional: { label: 'Professional', className: 'bg-purple-100 text-purple-700' },
  enterprise: { label: 'Enterprise', className: 'bg-gray-900 text-white' },
}

const categoryIcons = {
  NDIS: Shield,
  'Aged Care': BookOpen,
  Templates: Clipboard,
  Guides: BookOpen,
}

function getCategoryIcon(category: string) {
  return categoryIcons[category as keyof typeof categoryIcons] ?? FileText
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function buildCategoryCounts(resources: Resource[]) {
  return resources.reduce<Record<string, number>>((counts, resource) => {
    counts[resource.category] = (counts[resource.category] ?? 0) + 1
    return counts
  }, {})
}

function canAccessResource(resource: Resource, profile: ProfileAccess) {
  if (resource.access_tier === 'free') {
    return true
  }

  if (!profile) {
    return false
  }

  if (profile.role === 'admin') {
    return true
  }

  const tierRank: Record<'free' | 'starter' | 'professional' | 'enterprise', number> = {
    free: 0,
    starter: 1,
    professional: 2,
    enterprise: 3,
  }

  return (tierRank[profile.subscription_tier ?? 'free'] ?? 0) >= tierRank[resource.access_tier]
}

export default async function ResourcesPage() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('resources')
    .select('id, created_at, title, description, content, file_url, category, tags, access_tier, download_count')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role, subscription_tier')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  const resources = data ?? []
  const categoryCounts = buildCategoryCounts(resources)

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-green-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
            Resource Library
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Essential Care Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Published policy templates, guides, toolkits, and checklists for Australian care organisations and professionals.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="px-3 py-1.5">
              All resources ({resources.length})
            </Badge>
            {Object.entries(categoryCounts).map(([category, count]) => {
              const CategoryIcon = getCategoryIcon(category)

              return (
                <Badge key={category} variant="outline" className="px-3 py-1.5 gap-1.5">
                  <CategoryIcon className="h-3.5 w-3.5" />
                  {category} ({count})
                </Badge>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <Card>
              <CardContent className="p-10 text-center">
                <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900">Resources could not be loaded</h2>
                <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
              </CardContent>
            </Card>
          ) : resources.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">No resources published yet</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Approved resources will appear here once they are published.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((resource) => {
                const tier = tierBadge[resource.access_tier]
                const isLocked = !canAccessResource(resource, profile)
                const CategoryIcon = getCategoryIcon(resource.category)

                return (
                  <Card key={resource.id} className="card-hover group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                          <CategoryIcon className="h-5 w-5 text-green-700" />
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tier.className}`}>
                          {isLocked && <Lock className="h-3 w-3" />}
                          {tier.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                        {resource.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 mb-4">
                        Published {formatDate(resource.created_at)}
                        {resource.download_count > 0 && (
                          <> · {resource.download_count.toLocaleString()} downloads</>
                        )}
                      </div>
                      {isLocked ? (
                        <Link href="/pricing">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            <Lock className="h-3 w-3" />
                            View Access Plans
                          </Button>
                        </Link>
                      ) : resource.file_url ? (
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="default" size="sm" className="w-full text-xs">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </a>
                      ) : resource.content ? (
                        <Link href={`/resources/${resource.id}`}>
                          <Button variant="default" size="sm" className="w-full text-xs">
                            <ArrowRight className="h-3 w-3" />
                            Open Resource
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                          File Pending
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Need a Specific Resource?
          </h2>
          <p className="text-teal-100 mb-6">
            Contact the team to request templates, guides, or compliance resources for your care setting.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="white">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

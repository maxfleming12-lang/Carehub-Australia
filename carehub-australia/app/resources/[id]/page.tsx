import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseServerClient } from '@/lib/supabase-server'

type ResourcePageProps = {
  params: Promise<{ id: string }>
}

async function getResource(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('resources')
    .select('id, title, description, content, file_url, category, tags, access_tier, created_at')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()

  return data
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { id } = await params
  const resource = await getResource(id)

  if (!resource) {
    return { title: 'Resource Not Found' }
  }

  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical: `/resources/${resource.id}` },
  }
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { id } = await params
  const resource = await getResource(id)

  if (!resource) {
    notFound()
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 to-green-900 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-green-200 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-green-500/20 text-green-200 border-green-500/30">{resource.category}</Badge>
            <Badge className="bg-white/10 text-white border-white/20">{resource.access_tier}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{resource.title}</h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">{resource.description}</p>
          <p className="text-sm text-green-100 mt-5">Published {formatDate(resource.created_at)}</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-green-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Resource Content</h2>
                  <p className="text-sm text-gray-500">{resource.tags.join(', ')}</p>
                </div>
              </div>
              {resource.file_url && (
                <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="default">
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </a>
              )}
            </div>

            {resource.content ? (
              <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
                {resource.content}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">This resource file is being prepared.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

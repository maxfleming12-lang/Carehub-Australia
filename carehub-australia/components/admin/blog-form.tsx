'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type BlogFormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string
  is_published: boolean
  seo_title: string
  seo_description: string
}

type BlogFormProps = {
  initialData?: BlogFormData & { id: string }
  onSubmit: (data: BlogFormData) => Promise<void>
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: initialData || {
      title: '', slug: '', excerpt: '', content: '',
      tags: '', is_published: false, seo_title: '', seo_description: '',
    },
  })

  const watchIsPublished = watch('is_published')

  const handleFormSubmit = async (data: BlogFormData) => {
    setIsLoading(true)
    setError('')
    try {
      await onSubmit(data)
      router.push('/admin/blog')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardHeader><CardTitle>Post Details</CardTitle><CardDescription>Title, slug, and excerpt</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="e.g., 5 Tips for NDIS Support Workers"
              {...register('title', { required: 'Title is required' })}
              onChange={(e) => { register('title').onChange(e); if (!initialData) setValue('slug', slugify(e.target.value)) }}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" placeholder="url-friendly-slug" {...register('slug', { required: 'Slug is required' })} />
            {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea id="excerpt" rows={3} placeholder="Short summary shown in listing..." {...register('excerpt', { required: 'Excerpt is required' })} />
            {errors.excerpt && <p className="text-sm text-red-500 mt-1">{errors.excerpt.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Content</CardTitle><CardDescription>Full post body</CardDescription></CardHeader>
        <CardContent>
          <Textarea id="content" rows={16} placeholder="Write your post content here..." {...register('content', { required: 'Content is required' })} />
          {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tags & SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="NDIS, aged care, wellbeing (comma-separated)" {...register('tags')} />
          </div>
          <div>
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input id="seo_title" placeholder="Custom browser title (optional)" {...register('seo_title')} />
          </div>
          <div>
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea id="seo_description" rows={2} placeholder="Meta description for search engines (optional)" {...register('seo_description')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_published" {...register('is_published')} className="rounded" />
            <Label htmlFor="is_published" className="font-normal cursor-pointer">Publish this post (visible to all visitors)</Label>
          </div>
          {watchIsPublished && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-3">
              <p className="text-xs text-green-800">✓ This post will be publicly visible on the blog.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? 'Update Post' : 'Create Post'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
      </div>
    </form>
  )
}

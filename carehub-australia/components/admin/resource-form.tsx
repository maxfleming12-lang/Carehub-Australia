'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(1000),
  content: z.string().default(''),
  file_url: z.string().default(''),
  category: z.enum(['NDIS', 'Aged Care', 'Templates', 'Guides']),
  tags: z.string().default(''),
  access_tier: z.enum(['free', 'starter', 'professional', 'enterprise']),
  is_published: z.boolean().default(false),
})

type ResourceFormData = z.infer<typeof resourceSchema>

type ResourceFormProps = {
  initialData?: ResourceFormData & { id: string }
  onSubmit: (data: ResourceFormData) => Promise<void>
}

export function ResourceForm({ initialData, onSubmit }: ResourceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          category: 'Guides',
          access_tier: 'free',
          is_published: false,
          tags: '',
          title: '',
          description: '',
          content: '',
          file_url: '',
        },
  })

  const watchTags = watch('tags')
  const watchIsPublished = watch('is_published')

  const handleFormSubmit = async (data: ResourceFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      router.push('/admin/resources')
      router.refresh()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Resource title and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., NDIS Support Coordination Guide"
              {...register('title')}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief overview of the resource"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content & Files</CardTitle>
          <CardDescription>Resource content or file URL</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Full resource content (markdown or plain text)"
              rows={8}
              {...register('content')}
            />
            <p className="text-xs text-gray-500 mt-1">Or provide a file URL below instead</p>
          </div>

          <div>
            <Label htmlFor="file_url">File URL</Label>
            <Input
              id="file_url"
              type="url"
              placeholder="https://example.com/resource.pdf"
              {...register('file_url')}
            />
            <p className="text-xs text-gray-500 mt-1">Direct link to downloadable file (PDF, DOCX, etc.)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
          <CardDescription>Category, tags, and access tier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NDIS">NDIS</SelectItem>
                    <SelectItem value="Aged Care">Aged Care</SelectItem>
                    <SelectItem value="Templates">Templates</SelectItem>
                    <SelectItem value="Guides">Guides</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="e.g., compliance, support, guide (comma-separated)"
              {...register('tags')}
            />
            <p className="text-xs text-gray-500 mt-1">
              {typeof watchTags === 'string' && watchTags.length > 0
                ? `Tags: ${watchTags.split(',').map((t) => t.trim()).filter(Boolean).join(', ')}`
                : 'No tags'}
            </p>
          </div>

          <div>
            <Label htmlFor="access_tier">Access Tier *</Label>
            <Controller
              name="access_tier"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="access_tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter+</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
          <CardDescription>Control visibility and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              {...register('is_published')}
              className="rounded"
            />
            <Label htmlFor="is_published" className="font-normal cursor-pointer">
              Publish this resource (make it visible to users)
            </Label>
          </div>
          {watchIsPublished && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-xs text-green-800">
                ✓ This resource will be visible to users with appropriate access tier.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? 'Update Resource' : 'Create Resource'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

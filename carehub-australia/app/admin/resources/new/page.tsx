import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResourceForm } from '@/components/admin/resource-form'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createResource } from '../actions'

export const metadata: Metadata = {
  title: 'Create Resource',
  description: 'Create a new resource',
}

export default async function NewResourcePage() {
  const supabase = await createSupabaseServerClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-600">Access denied.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Resource</h1>
          <p className="text-gray-600 mt-2">Add a new resource for users to access</p>
        </div>

        <ResourceForm onSubmit={createResource} />
      </div>
    </div>
  )
}

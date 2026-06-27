import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'

export type AdminProfile = {
  id: string
  full_name: string | null
  email: string
  role: 'user' | 'admin'
  subscription_tier: string | null
  subscription_status: string | null
}

export async function requireAdmin(): Promise<{ userId: string; profile: AdminProfile }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, subscription_tier, subscription_status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return { userId: user.id, profile: profile as AdminProfile }
}

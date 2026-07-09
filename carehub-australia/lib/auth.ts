import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'

export type UserProfile = {
  id: string
  full_name: string | null
  email: string
  role: 'user' | 'admin'
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise' | null
  subscription_status: 'active' | 'inactive' | 'trialing' | 'cancelled' | null
  organization: string | null
  state: string | null
}

export async function requireUser(nextPath = '/dashboard') {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, subscription_tier, subscription_status, organization, state')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return {
      user,
      profile: {
        id: user.id,
        full_name: user.user_metadata?.full_name ?? null,
        email: user.email ?? '',
        role: 'user',
        subscription_tier: 'free',
        subscription_status: null,
        organization: null,
        state: null,
      } satisfies UserProfile,
    }
  }

  return { user, profile: profile as UserProfile }
}

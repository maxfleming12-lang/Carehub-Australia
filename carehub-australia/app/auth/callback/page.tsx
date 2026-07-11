import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

type CallbackPageProps = {
  searchParams: Promise<{ code?: string; next?: string }>
}

export default async function AuthCallbackPage({ searchParams }: CallbackPageProps) {
  const { code, next } = await searchParams

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      redirect(next || '/dashboard')
    }
  }

  redirect('/auth/login')
}

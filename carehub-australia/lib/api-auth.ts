import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { getSupabasePublicConfig } from '@/lib/supabase-config'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization')
  const match = header?.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

export async function getAuthenticatedSupabaseClient(request: NextRequest) {
  const cookieClient = await createSupabaseServerClient()
  const {
    data: { user: cookieUser },
  } = await cookieClient.auth.getUser()

  if (cookieUser) {
    return { supabase: cookieClient, user: cookieUser }
  }

  const token = getBearerToken(request)

  if (!token) {
    return { supabase: cookieClient, user: null }
  }

  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()

  if (!supabaseUrl || !supabaseKey) {
    return { supabase: cookieClient, user: null }
  }

  const tokenClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const {
    data: { user },
  } = await tokenClient.auth.getUser(token)

  return { supabase: tokenClient, user }
}

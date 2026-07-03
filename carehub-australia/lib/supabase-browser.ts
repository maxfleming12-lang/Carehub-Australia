'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicConfig } from '@/lib/supabase-config'
import type { Database } from '@/types/database'

type BrowserClientResult =
  | {
      supabase: ReturnType<typeof createBrowserClient<Database>>
      error: null
    }
  | {
      supabase: null
      error: string
    }

function isHeaderSafe(value: string) {
  return /^[\x21-\x7E]+$/.test(value)
}

export function createSupabaseBrowserClient(
  unconfiguredMessage = 'Login is not configured yet. Please contact support.'
): BrowserClientResult {
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()

  if (!supabaseUrl || !supabaseKey) {
    return {
      supabase: null,
      error: unconfiguredMessage,
    }
  }

  try {
    new URL(supabaseUrl)
  } catch {
    return {
      supabase: null,
      error: 'Supabase URL is invalid. Please check the site configuration.',
    }
  }

  if (!isHeaderSafe(supabaseKey)) {
    return {
      supabase: null,
      error:
        'Supabase publishable key contains invalid characters. Re-copy it from Supabase without smart quotes or hidden characters.',
    }
  }

  return {
    supabase: createBrowserClient<Database>(supabaseUrl, supabaseKey),
    error: null,
  }
}

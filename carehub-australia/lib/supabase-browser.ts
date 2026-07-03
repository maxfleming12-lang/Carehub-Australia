'use client'

import { createBrowserClient } from '@supabase/ssr'
import {
  getSupabasePublicConfig,
  isPlaceholderSupabaseValue,
} from '@/lib/supabase-config'
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

function buildBrowserClient(
  supabaseUrl: string | undefined,
  supabaseKey: string | undefined,
  unconfiguredMessage = 'Login is not configured yet. Please contact support.'
): BrowserClientResult {
  if (
    !supabaseUrl ||
    !supabaseKey ||
    isPlaceholderSupabaseValue(supabaseUrl) ||
    isPlaceholderSupabaseValue(supabaseKey)
  ) {
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

export async function createSupabaseBrowserClient(
  unconfiguredMessage = 'Login is not configured yet. Please contact support.'
): Promise<BrowserClientResult> {
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()
  const bundledClient = buildBrowserClient(
    supabaseUrl,
    supabaseKey,
    unconfiguredMessage
  )

  if (bundledClient.supabase) {
    return bundledClient
  }

  try {
    const response = await fetch('/api/auth/config', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return bundledClient
    }

    const config = (await response.json()) as {
      supabaseUrl?: string
      supabaseKey?: string
    }

    return buildBrowserClient(
      config.supabaseUrl,
      config.supabaseKey,
      unconfiguredMessage
    )
  } catch {
    return bundledClient
  }
}

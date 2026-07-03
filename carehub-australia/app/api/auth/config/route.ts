import { NextResponse } from 'next/server'
import {
  getSupabasePublicConfig,
  isPlaceholderSupabaseValue,
} from '@/lib/supabase-config'

export const dynamic = 'force-dynamic'

function isValidSupabaseUrl(value: string | undefined) {
  if (!value || isPlaceholderSupabaseValue(value)) {
    return false
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')
  } catch {
    return false
  }
}

function getUrlHost(value: string | undefined) {
  try {
    return value ? new URL(value).hostname : null
  } catch {
    return null
  }
}

export function GET() {
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()
  const urlConfigured = isValidSupabaseUrl(supabaseUrl)
  const keyConfigured = !isPlaceholderSupabaseValue(supabaseKey)

  if (!urlConfigured || !keyConfigured) {
    return NextResponse.json(
      {
        configured: false,
        checks: {
          supabaseUrl: {
            present: Boolean(supabaseUrl),
            valid: urlConfigured,
            host: getUrlHost(supabaseUrl),
          },
          supabaseKey: {
            present: Boolean(supabaseKey),
            valid: keyConfigured,
            length: supabaseKey?.length ?? 0,
          },
        },
        error:
          'Supabase public environment variables are missing or still contain placeholder values.',
      },
      { status: 503 }
    )
  }

  return NextResponse.json(
    {
      configured: true,
      supabaseUrl,
      supabaseKey,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}

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

export function GET() {
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()

  if (!isValidSupabaseUrl(supabaseUrl) || isPlaceholderSupabaseValue(supabaseKey)) {
    return NextResponse.json(
      {
        configured: false,
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

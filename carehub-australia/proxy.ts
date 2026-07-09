import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabasePublicConfig } from './lib/supabase-config'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()

  if (!supabaseUrl || !supabaseKey) {
    if (isAdminLoginPage) {
      return NextResponse.next({ request })
    }

    const loginPath = isAdminRoute ? '/admin/login' : '/auth/login'
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Unauthenticated request to any admin route → redirect to admin login
  if (isAdminRoute && !isAdminLoginPage && !user) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isDashboardRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already authenticated user visiting admin login → send to dashboard
  if (isAdminLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}

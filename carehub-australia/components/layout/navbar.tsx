'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Heart, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  {
    name: 'Tools',
    href: '#',
    children: [
      { name: 'Assessments', href: '/assessments', description: 'Burnout & wellness tools' },
      { name: 'AI Document Builder', href: '/ai-document-builder', description: 'Generate care documents' },
      { name: 'Shift Note Creator', href: '/shift-notes', description: 'Professional shift notes' },
    ],
  },
  { name: 'Training', href: '/training' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Subscribe to auth state
  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    createSupabaseBrowserClient().then(({ supabase }) => {
      if (!supabase) {
        setAuthLoading(false)
        return
      }

      // Get initial session
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user ?? null)
        setAuthLoading(false)
      })

      // Listen for changes
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setAuthLoading(false)
      })

      unsubscribe = () => listener.subscription.unsubscribe()
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setUserDropdownOpen(false)
    if (userDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [userDropdownOpen])

  const handleSignOut = async () => {
    const { supabase } = await createSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'
  const initials = displayName.slice(0, 2).toUpperCase()

  // At the top of the page the navbar sits over dark hero sections on some
  // routes and the plain white body on others (pages padded with pt-16), so a
  // transparent bar can't be readable everywhere. Give the unscrolled navbar
  // its own dark translucent background with light text; once the user
  // scrolls (or opens the mobile menu) it switches to white with dark text.
  const solid = scrolled || mobileOpen

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        solid ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-gray-900/70 backdrop-blur-md'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-blue-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={cn('text-lg font-bold', solid ? 'text-gray-900' : 'text-white')}>Scribe & Thrive</span>
              <span className={cn('text-xs font-medium', solid ? 'text-teal-600' : 'text-teal-300')}>Australia</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      solid
                        ? 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                        : 'text-gray-100 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', activeDropdown === item.name && 'rotate-180')} />
                  </button>
                  {activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-white shadow-lg border border-gray-100 py-2 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-3 hover:bg-teal-50 transition-colors"
                        >
                          <div className="text-sm font-semibold text-gray-900">{child.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{child.description}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href
                      ? solid
                        ? 'text-teal-600 bg-teal-50'
                        : 'text-white bg-white/15'
                      : solid
                        ? 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                        : 'text-gray-100 hover:text-white hover:bg-white/10'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {authLoading ? (
              <div className={cn('h-8 w-24 rounded-lg animate-pulse', solid ? 'bg-gray-100' : 'bg-white/20')} />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setUserDropdownOpen(!userDropdownOpen) }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                    solid ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  )}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className={cn('text-sm font-medium max-w-[120px] truncate', solid ? 'text-gray-700' : 'text-white')}>{displayName}</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', solid ? 'text-gray-400' : 'text-gray-200', userDropdownOpen && 'rotate-180')} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Account
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    !solid && 'text-white hover:text-white hover:bg-white/10'
                  )}
                >
                  Sign In
                </Link>
                <Link href="/auth/register" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              'lg:hidden p-2 rounded-lg',
              solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name}>
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {item.name}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block px-6 py-2 text-sm text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-sm font-medium rounded-lg',
                    pathname === item.href
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}

            {/* Mobile auth */}
            <div className="pt-4 flex flex-col gap-2 border-t border-gray-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-start gap-2')}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => { setMobileOpen(false); handleSignOut() }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ variant: 'primary' }), 'w-full')}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

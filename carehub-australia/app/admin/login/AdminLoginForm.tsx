'use client'

import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/admin'
  }

  return next
}

export function AdminLoginForm() {
  const searchParams = useSearchParams()
  const next = getSafeNextPath(searchParams.get('next'))

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { supabase, error: configError } = await createSupabaseBrowserClient(
        'Admin login is not configured yet. Please contact support.'
      )

      if (configError || !supabase) {
        setError(configError)
        setLoading(false)
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Invalid credentials. Ensure your account has admin access.')
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Authentication failed.')
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('Access denied. This login is restricted to administrators.')
        setLoading(false)
        return
      }

      window.location.href = next
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Email address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sataus.net"
            required
            autoComplete="email"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-red-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white mt-2"
        >
          {loading ? 'Verifying...' : 'Sign in to Admin'}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">
          Not an administrator?{' '}
          <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
            Return to regular login
          </Link>
        </p>
      </div>
    </div>
  )
}

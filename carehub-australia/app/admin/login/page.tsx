'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

function AdminLoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Invalid credentials. Ensure your account has admin access.')
      setLoading(false)
      return
    }

    // Verify admin role before allowing access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Authentication failed.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Access denied. This login is restricted to administrators.')
      setLoading(false)
      return
    }

    window.location.href = next
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
            placeholder="admin@carehub.com.au"
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
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

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <Shield className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">CareHub Australia · Restricted Area</p>
        </div>

        <Suspense fallback={<div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 h-48 animate-pulse" />}>
          <AdminLoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-gray-700">
          All admin actions are logged and audited.
        </p>
      </div>
    </div>
  )
}

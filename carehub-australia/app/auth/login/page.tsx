'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Heart, ArrowRight, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

function getSafeNextPath() {
  if (typeof window === 'undefined') {
    return '/dashboard'
  }

  const next = new URLSearchParams(window.location.search).get('next')

  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard'
  }

  return next
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // Show OAuth error if redirected back from failed callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') === 'oauth_failed') {
        setError('Google sign-in failed. Please try again or use email/password.')
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { supabase, error: configError } = await createSupabaseBrowserClient()

      if (configError || !supabase) {
        setError(configError)
        setLoading(false)
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      await supabase.auth.getSession()
      window.location.assign(getSafeNextPath())
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { supabase, error: configError } = await createSupabaseBrowserClient()

      if (configError || !supabase) {
        setError(configError)
        setLoading(false)
        return
      }

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getSafeNextPath())}`,
        },
      })

      if (googleError) {
        setError(googleError.message)
        setLoading(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 to-teal-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Scribe & Thrive Australia</span>
          </Link>
        </div>

        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in to your Scribe & Thrive account</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-sm font-medium text-gray-700 block mb-1.5">
                  Email Address
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com.au"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-teal-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Google
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-teal-600 hover:underline font-medium">
                  Create free account
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                🔒 Secure login · Australian data storage
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in you agree to our{' '}
          <Link href="/terms" className="text-teal-400 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-teal-400 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

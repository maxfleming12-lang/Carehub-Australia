'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { supabase, error: configError } = await createSupabaseBrowserClient(
        'Password recovery is not configured yet. Please contact support.'
      )

      if (configError || !supabase) {
        setError(configError)
        setLoading(false)
        return
      }

      const redirectTo = `${window.location.origin}/auth/reset-password`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-teal-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-blue-600">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
              <p className="mt-1 text-sm text-gray-500">
                Enter your email and we&apos;ll send a secure recovery link.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success ? (
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-5 text-center">
                <MailCheck className="mx-auto mb-2 h-8 w-8 text-teal-600" />
                <p className="font-semibold text-teal-800">Check your inbox</p>
                <p className="mt-1 text-sm text-teal-700">
                  If an account exists for <strong>{email}</strong>, you&apos;ll receive a password reset link shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Sending link...' : 'Send reset link'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-teal-600 hover:underline">
                Return to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Heart, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const benefits = [
  '14-day free Professional trial',
  'No credit card required',
  'Cancel anytime',
  'NDIS compliant tools',
  'Australian data storage',
  'Cancel anytime',
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    organisation: '',
    role: '',
    state: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In production: call Supabase auth API
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    window.location.href = '/dashboard'
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 to-teal-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div className="text-white hidden md:block">
            <Link href="/" className="flex items-center gap-2 mb-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">CareHub Australia</div>
              </div>
            </Link>

            <h2 className="text-3xl font-bold mb-4">
              Join Australia&apos;s Largest Care Community
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Over 12,000 care professionals trust CareHub to save time, stay compliant, and deliver better outcomes.
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span className="text-gray-200">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-5 rounded-xl bg-white/10 border border-white/20">
              <p className="text-sm text-gray-200 italic leading-relaxed">
                &ldquo;The AI document builder alone saves me an hour each day. Worth every cent.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold">JM</div>
                <div>
                  <div className="text-xs font-semibold">Jenny Murphy</div>
                  <div className="text-xs text-gray-400">Support Coordinator, Perth</div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration form */}
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2 md:hidden">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-blue-600">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">CareHub Australia</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Create Your Free Account</h1>
                <p className="text-sm text-gray-500 mt-1">14-day Professional trial included</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Jane Smith"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="jane@organisation.com.au"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Organisation (optional)
                  </label>
                  <Input
                    placeholder="Your workplace or organisation"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Role</label>
                    <select
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="">Select role</option>
                      <option>Support Worker</option>
                      <option>Care Manager</option>
                      <option>Coordinator</option>
                      <option>Nurse</option>
                      <option>Allied Health</option>
                      <option>Admin / Manager</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">State</label>
                    <select
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                      <option value="">State</option>
                      <option>NSW</option>
                      <option>VIC</option>
                      <option>QLD</option>
                      <option>WA</option>
                      <option>SA</option>
                      <option>TAS</option>
                      <option>ACT</option>
                      <option>NT</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-0.5 rounded" required />
                  <label htmlFor="terms" className="text-xs text-gray-500">
                    I agree to the{' '}
                    <Link href="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
                    I understand my data will be stored in Australia.
                  </label>
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
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Free Account
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-teal-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  🔒 256-bit SSL encryption · Australian data storage · ISO 27001 certified
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

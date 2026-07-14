import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Shield } from 'lucide-react'
import { AdminLoginForm } from './AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Sign In',
  robots: { index: false, follow: false },
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
          <p className="text-sm text-gray-500 mt-1">Scribe & Thrive Australia · Restricted Area</p>
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

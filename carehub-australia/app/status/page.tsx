import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = pageMetadata({
  title: "System Status",
  description:
    "Live operational status of the Scribe & Thrive Australia platform.",
  path: "/status",
})

export default function StatusPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">All Systems Operational</h1>
        <p className="text-gray-500 mb-2">
          Platform, AI services, and authentication are running normally.
        </p>
        <p className="text-sm text-gray-400">
          Issues? Email <a href="mailto:hello@sataus.net" className="text-teal-600 hover:underline">hello@sataus.net</a>
        </p>
      </div>
    </div>
  )
}

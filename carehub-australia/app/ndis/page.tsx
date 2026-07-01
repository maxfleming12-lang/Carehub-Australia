import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'NDIS Resources' }

export default function NdisPage() {
  return (
    <ComingSoon
      title="NDIS Resources — Coming Soon"
      description="A dedicated hub of NDIS-specific guides, templates, and updates. Coming soon. In the meantime, visit our Resources library for general care tools."
    />
  )
}

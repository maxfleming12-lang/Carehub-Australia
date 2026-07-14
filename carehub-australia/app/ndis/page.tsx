import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = pageMetadata({
  title: "NDIS Resources",
  description:
    "NDIS-specific guides, templates, and updates for Australian disability support professionals.",
  path: "/ndis",
})

export default function NdisPage() {
  return (
    <ComingSoon
      title="NDIS Resources — Coming Soon"
      description="A dedicated hub of NDIS-specific guides, templates, and updates. Coming soon. In the meantime, visit our Resources library for general care tools."
    />
  )
}

import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = pageMetadata({
  title: "Help Centre",
  description:
    "Help articles and support for Scribe & Thrive Australia users.",
  path: "/help",
})

export default function HelpPage() {
  return (
    <ComingSoon
      title="Help Centre — Coming Soon"
      description="Our help articles and video tutorials are being prepared. For immediate support, email hello@sataus.net or call 0451 381 843."
    />
  )
}

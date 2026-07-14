import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join the Scribe & Thrive Australia team and help build tools for the Australian care community.",
  path: "/careers",
})

export default function CareersPage() {
  return (
    <ComingSoon
      title="Careers — Coming Soon"
      description="We're growing! Job listings will appear here soon. In the meantime, send your resume to hello@sataus.net and tell us how you'd like to contribute."
    />
  )
}

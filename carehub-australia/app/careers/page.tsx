import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Careers' }

export default function CareersPage() {
  return (
    <ComingSoon
      title="Careers — Coming Soon"
      description="We're growing! Job listings will appear here soon. In the meantime, send your resume to hello@sataus.net and tell us how you'd like to contribute."
    />
  )
}

import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Help Centre' }

export default function HelpPage() {
  return (
    <ComingSoon
      title="Help Centre — Coming Soon"
      description="Our help articles and video tutorials are being prepared. For immediate support, email hello@sataus.net or call 0451 381 843."
    />
  )
}

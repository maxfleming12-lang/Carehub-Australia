import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Community Forum' }

export default function CommunityPage() {
  return (
    <ComingSoon
      title="Community Forum — Coming Soon"
      description="A space for Australian care workers to share experiences, tips, and resources. Launching soon — join the waitlist via our contact page."
    />
  )
}

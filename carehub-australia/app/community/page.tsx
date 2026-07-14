import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = pageMetadata({
  title: "Community Forum",
  description:
    "A community space for Australian care workers to share experiences, tips, and resources.",
  path: "/community",
})

export default function CommunityPage() {
  return (
    <ComingSoon
      title="Community Forum — Coming Soon"
      description="A space for Australian care workers to share experiences, tips, and resources. Launching soon — join the waitlist via our contact page."
    />
  )
}

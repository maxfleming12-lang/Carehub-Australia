import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Shift Note Creator',
  description:
    'Create professional, NDIS-compliant shift notes in seconds with AI assistance. Built for Australian support workers and care teams.',
  path: '/shift-notes',
})

export default function ShiftNotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

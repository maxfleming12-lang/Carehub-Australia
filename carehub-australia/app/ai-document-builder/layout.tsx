import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'AI Document Builder',
  description:
    'Generate NDIS-compliant care plans, support letters, incident reports and more in seconds with AI, built for Australian care professionals.',
  path: '/ai-document-builder',
})

export default function AiDocumentBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

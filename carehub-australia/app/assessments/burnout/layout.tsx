import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Burnout Assessment',
  description:
    'Assess your burnout risk with a validated self-assessment for Australian care workers and receive personalised support recommendations.',
  path: '/assessments/burnout',
})

export default function BurnoutAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

// Auth pages should not be indexed by search engines.
export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

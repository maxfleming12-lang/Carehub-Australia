import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Scribe & Thrive Australia accessibility statement.",
  path: "/accessibility",
})

export default function AccessibilityPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Accessibility</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Accessibility Statement</h1>
        </div>
      </section>
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <p>
            Scribe &amp; Thrive Australia is committed to making our platform accessible to all users,
            including those with disabilities, in accordance with the <em>Disability Discrimination Act 1992</em> (Cth).
          </p>
          <h2>Our Commitment</h2>
          <ul>
            <li>We aim for WCAG 2.1 Level AA conformance across all pages</li>
            <li>All form inputs include visible labels</li>
            <li>Colour contrast meets minimum AA ratios</li>
            <li>The platform is keyboard-navigable</li>
            <li>Screen reader compatibility is tested regularly</li>
          </ul>
          <h2>Known Issues</h2>
          <p>
            We are continuously improving. If you encounter an accessibility barrier, please contact us so
            we can address it.
          </p>
          <h2>Contact</h2>
          <p>
            Accessibility feedback:{' '}
            <a href="mailto:hello@sataus.net" className="text-teal-600 hover:underline">hello@sataus.net</a>{' '}
            or call{' '}
            <a href="tel:0451381843" className="text-teal-600 hover:underline">0451 381 843</a>
          </p>
        </div>
      </section>
    </div>
  )
}

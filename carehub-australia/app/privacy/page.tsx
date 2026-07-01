import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Scribe & Thrive Australia collects, uses, and protects your personal information.',
}

const lastUpdated = '1 July 2026'

export default function PrivacyPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Legal</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2>1. Who We Are</h2>
          <p>
            Scribe &amp; Thrive Australia (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) ABN 88 790 271 132 operates the
            platform at sataus.net. This Privacy Policy explains how we handle personal information in
            accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you provide directly, including:</p>
          <ul>
            <li>Name and email address (account registration)</li>
            <li>Organisation name and Australian state</li>
            <li>Payment details (processed securely by Stripe — we never store card numbers)</li>
            <li>Shift notes, care documents, and assessment results you create on the platform</li>
            <li>Usage data and session logs for platform improvement</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>Provide and maintain the Scribe &amp; Thrive Australia platform</li>
            <li>Process subscription payments via Stripe</li>
            <li>Send essential service communications (receipts, security alerts)</li>
            <li>Provide AI-assisted document generation via OpenAI (your prompts are not used to train OpenAI models)</li>
            <li>Improve the platform through aggregated, anonymised analytics</li>
          </ul>
          <p>We will never sell your personal information to third parties.</p>

          <h2>4. Data Storage and Security</h2>
          <p>
            All data is stored in Australian data centres via Supabase (Sydney region). Data is encrypted
            at rest (AES-256) and in transit (TLS 1.3). We employ role-based access controls and audit
            logging for all administrative actions.
          </p>

          <h2>5. Your Documents and Notes</h2>
          <p>
            Shift notes, care plans, and other documents you create remain your property. Administrators of
            the platform have access to your account details (name, email, subscription) for support
            purposes only. Administrators do <strong>not</strong> have access to your documents, shift notes,
            or assessment results.
          </p>

          <h2>6. Third-Party Services</h2>
          <ul>
            <li><strong>Supabase</strong> — database and authentication (Australia)</li>
            <li><strong>Stripe</strong> — payment processing (subject to Stripe&apos;s Privacy Policy)</li>
            <li><strong>OpenAI</strong> — AI document generation (content is not used for model training under our enterprise agreement)</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            We use essential session cookies required for authentication. We do not use advertising or
            tracking cookies. See our <a href="/cookies" className="text-teal-600 hover:underline">Cookie Policy</a> for details.
          </p>

          <h2>8. Access and Correction</h2>
          <p>
            Under the Privacy Act 1988 you have the right to access and correct your personal information.
            To make a request, email us at{' '}
            <a href="mailto:hello@sataus.net" className="text-teal-600 hover:underline">hello@sataus.net</a>.
            We will respond within 30 days.
          </p>

          <h2>9. Complaints</h2>
          <p>
            If you believe we have mishandled your personal information, please contact us first. If you
            are not satisfied with our response, you may lodge a complaint with the{' '}
            <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
              Office of the Australian Information Commissioner (OAIC)
            </a>.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify registered users of material
            changes by email at least 14 days before they take effect.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            Questions about this policy? Contact us at{' '}
            <a href="mailto:hello@sataus.net" className="text-teal-600 hover:underline">hello@sataus.net</a>{' '}
            or call <a href="tel:0451381843" className="text-teal-600 hover:underline">0451 381 843</a>.
          </p>
        </div>
      </section>
    </div>
  )
}

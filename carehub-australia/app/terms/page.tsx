import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Scribe & Thrive Australia.',
}

const lastUpdated = '1 July 2026'

export default function TermsPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Legal</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2>1. Acceptance</h2>
          <p>
            By creating an account or using Scribe &amp; Thrive Australia (&ldquo;the Platform&rdquo;), operated by
            Scribe &amp; Thrive Australia ABN 88 790 271 132, you agree to these Terms of Service. If you do
            not agree, do not use the Platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Scribe &amp; Thrive Australia is a SaaS platform providing AI-assisted documentation tools,
            training resources, assessments, and compliance support for Australian care workers,
            disability support professionals, and aged care organisations.
          </p>

          <h2>3. Accounts</h2>
          <ul>
            <li>You must be 18 years or older to create an account.</li>
            <li>You are responsible for maintaining the security of your login credentials.</li>
            <li>You must notify us immediately of any unauthorised access at <a href="mailto:hello@sataus.net" className="text-teal-600">hello@sataus.net</a>.</li>
            <li>One person may not maintain more than one free account.</li>
          </ul>

          <h2>4. Subscriptions and Payments</h2>
          <ul>
            <li>Subscriptions are billed monthly in Australian dollars (AUD) via Stripe.</li>
            <li>Subscriptions renew automatically. You may cancel at any time from your account settings.</li>
            <li>Cancellation takes effect at the end of the current billing period — no partial refunds.</li>
            <li>We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.</li>
          </ul>

          <h2>5. Acceptable Use</h2>
          <p>You must not use the Platform to:</p>
          <ul>
            <li>Upload false, misleading, or fraudulent information about any client or patient</li>
            <li>Violate any Australian federal, state, or territory law</li>
            <li>Attempt to reverse-engineer, scrape, or extract data from the Platform</li>
            <li>Share your account credentials with other individuals</li>
            <li>Use AI-generated documents without reviewing them for accuracy before use in clinical or care settings</li>
          </ul>

          <h2>6. AI-Generated Content</h2>
          <p>
            The Platform uses artificial intelligence to assist with document creation. You acknowledge that:
          </p>
          <ul>
            <li>AI-generated content is a starting point only and must be reviewed by a qualified professional before use.</li>
            <li>We make no warranty that AI-generated content meets any specific clinical, legal, or regulatory standard.</li>
            <li>You are solely responsible for the accuracy and appropriateness of any documents you create, modify, or submit.</li>
          </ul>

          <h2>7. Your Content</h2>
          <p>
            You retain ownership of all shift notes, documents, and other content you create on the Platform.
            You grant us a limited licence to store and process your content solely to provide the service.
            We do not use your content to train AI models.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Your use of the Platform is also governed by our{' '}
            <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>, which is
            incorporated into these Terms.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by Australian Consumer Law, our total liability to you for any
            loss or damage arising from your use of the Platform is limited to the fees you paid us in the
            three months preceding the claim. We are not liable for indirect, consequential, or special
            damages.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your account if you breach these Terms, with or without notice. You
            may delete your account at any time. Upon termination, your data is retained for 30 days and
            then permanently deleted.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of New South Wales, Australia. Any disputes will be
            resolved in the courts of New South Wales.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these Terms?{' '}
            <a href="mailto:hello@sataus.net" className="text-teal-600 hover:underline">hello@sataus.net</a>{' '}
            or call <a href="tel:0451381843" className="text-teal-600 hover:underline">0451 381 843</a>.
          </p>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "How Scribe & Thrive Australia uses cookies.",
  path: "/cookies",
})

export default function CookiesPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Legal</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Cookie Policy</h1>
        </div>
      </section>
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help the
            site remember your session and preferences.
          </p>
          <h2>Cookies We Use</h2>
          <table>
            <thead>
              <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>sb-*</code></td>
                <td>Supabase authentication session — required for login to work</td>
                <td>Session / 1 week</td>
              </tr>
            </tbody>
          </table>
          <p>
            We do <strong>not</strong> use advertising cookies, tracking pixels, or third-party analytics
            cookies. No cookie consent banner is required because we only use strictly necessary cookies.
          </p>
          <h2>Managing Cookies</h2>
          <p>
            You can block or delete cookies in your browser settings. Blocking session cookies will
            prevent you from logging in to the platform.
          </p>
          <h2>Contact</h2>
          <p>
            Questions?{' '}
            <a href="mailto:hello@sataus.net" className="text-teal-600 hover:underline">hello@sataus.net</a>
          </p>
        </div>
      </section>
    </div>
  )
}

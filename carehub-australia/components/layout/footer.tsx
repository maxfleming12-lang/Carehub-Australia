import Link from 'next/link'
import { Heart, Phone, Mail, MapPin } from 'lucide-react'

const footerLinks = {
  platform: [
    { name: 'Resources', href: '/resources' },
    { name: 'Assessments', href: '/assessments' },
    { name: 'AI Document Builder', href: '/ai-document-builder' },
    { name: 'Shift Note Creator', href: '/shift-notes' },
    { name: 'Training Courses', href: '/training' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
  support: [
    { name: 'Help Centre', href: '/help' },
    { name: 'Community Forum', href: '/community' },
    { name: 'System Status', href: '/status' },
    { name: 'NDIS Resources', href: '/ndis' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA strip */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Supporting Australia&apos;s Carers, Every Step of the Way
          </h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            Use Scribe & Thrive Australia to support clearer documentation, practical training, and care resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-white text-teal-700 px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-500">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Scribe & Thrive Australia</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              The comprehensive SaaS platform for Australian care workers, disability support professionals, and aged care organisations.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>0451 381 843</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>hello@sataus.net</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>Sydney, NSW, Australia</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Scribe & Thrive Australia Pty Ltd. All rights reserved. ABN 88 790 271 132</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500" /> for Australia&apos;s care community
          </p>
        </div>
      </div>
    </footer>
  )
}

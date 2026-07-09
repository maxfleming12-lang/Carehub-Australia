import type { Metadata } from 'next'
import { Heart, Shield, Users, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Scribe & Thrive Australia — built by care workers, for care workers.',
}

const values = [
  {
    icon: Heart,
    title: 'Care First',
    description: 'Everything we build starts with what care workers actually need — less admin, more time with clients.',
  },
  {
    icon: Shield,
    title: 'Privacy & Safety',
    description: 'Client data stays in Australia, encrypted and secure. Admins can never access your notes or documents.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Our platform evolves from practical feedback from Australian support workers, coordinators, and managers.',
  },
  {
    icon: Award,
    title: 'Compliance Ready',
    description: 'Tools designed around NDIS Practice Standards, Aged Care Quality Standards, and Australian Privacy Law.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Our Story</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Built for the People Who Care
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Scribe &amp; Thrive Australia was created to give care workers back their time — so they
            can focus on what matters most: the people they support.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Australian care workers spend an average of two hours per shift on documentation alone.
                That&apos;s time taken away from clients, from families, and from the human moments that
                make care meaningful.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Scribe &amp; Thrive Australia combines AI, compliance tools, and practical training to cut
                that admin burden — helping workers scribe faster, stay compliant, and genuinely thrive
                in their roles.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re proudly Australian, with all data stored locally and tools designed specifically
                for the NDIS and aged care frameworks.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 'AU', label: 'Australian data focus' },
                  { value: 'NDIS', label: 'Care documentation alignment' },
                  { value: 'AI', label: 'Document drafting support' },
                  { value: 'RBAC', label: 'Admin access controls' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-teal-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 mb-4">
                  <v.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8">
            Whether you&apos;re a solo support worker or managing a large care organisation, Scribe &amp; Thrive
            Australia has tools built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register">
              <Button variant="primary" size="lg">Get Started Free</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Talk to Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Scribe & Thrive Australia team. We\'re here to help care professionals across Australia.',
}

const contactMethods = [
  {
    icon: Phone,
    label: 'Phone',
    value: '0451 381 843',
    subvalue: '',
    desc: 'Mon–Fri, 8am–6pm AEST',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@sataus.net',
    subvalue: '',
    desc: 'Usually replies within 4 hours',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MessageSquare,
    label: 'Live Chat',
    value: 'Chat with us',
    subvalue: '',
    desc: 'Available during business hours',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Australia-wide',
    subvalue: '',
    desc: 'Remote-first, serving all states',
    color: 'bg-orange-50 text-orange-600',
  },
]

export default function ContactPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            We&apos;re Here to Help
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our Australian-based team is ready to answer your questions and help you get the most out of Scribe & Thrive Australia.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {contactMethods.map((method) => (
              <Card key={method.label} className="text-center card-hover">
                <CardContent className="p-5">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${method.color} mb-3`}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{method.label}</h3>
                  <p className="font-medium text-gray-700 text-sm">{method.value}</p>
                  {method.subvalue && <p className="text-sm text-gray-500">{method.subvalue}</p>}
                  <p className="text-xs text-gray-400 mt-1">{method.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">First Name *</label>
                    <Input placeholder="Jane" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Last Name *</label>
                    <Input placeholder="Smith" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address *</label>
                  <Input type="email" placeholder="jane@organisation.com.au" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone (optional)</label>
                  <Input type="tel" placeholder="0400 000 000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Organisation</label>
                  <Input placeholder="Your organisation name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Subject *</label>
                  <select className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                    <option value="">Select a topic...</option>
                    <option>General enquiry</option>
                    <option>Sales / pricing</option>
                    <option>Technical support</option>
                    <option>Account billing</option>
                    <option>Feature request</option>
                    <option>Partnership enquiry</option>
                    <option>NDIS / regulatory question</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Message *</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={5}
                    placeholder="How can we help you? Please provide as much detail as possible."
                  />
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  Send Message
                  <Mail className="h-4 w-4" />
                </Button>
                <p className="text-xs text-gray-400">
                  By submitting this form you agree to our{' '}
                  <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>.
                  We never share your information with third parties.
                </p>
              </form>
            </div>

            {/* FAQ / Support options */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'How do I get started with Scribe & Thrive?',
                    a: 'Simply create a free account on our website. No credit card required. You\'ll get instant access to free features and a 14-day trial of our Professional plan.',
                  },
                  {
                    q: 'Is my client data secure?',
                    a: 'Absolutely. All data is encrypted in transit and at rest. We store data in Australian data centres and comply with the Australian Privacy Act 1988. We are ISO 27001 certified.',
                  },
                  {
                    q: 'Do you offer training or onboarding?',
                    a: 'Yes! We offer free onboarding calls for Professional and Enterprise customers. We also have extensive video tutorials, help articles, and a community forum.',
                  },
                  {
                    q: 'Can we get a custom quote for our organisation?',
                    a: 'Yes, we work with organisations of all sizes. Contact our sales team for custom pricing, white-labelling options, and enterprise features.',
                  },
                  {
                    q: 'What states do you operate in?',
                    a: 'Scribe & Thrive Australia operates across all Australian states and territories. Our content is tailored to Australian regulations including NDIS and Aged Care standards.',
                  },
                ].map((item) => (
                  <div key={item.q} className="rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>

              {/* Business hours */}
              <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <h3 className="font-bold text-teal-900 text-sm">Support Hours (AEST)</h3>
                </div>
                <div className="space-y-1 text-sm text-teal-800">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium">8:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">9:00 AM – 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday & Public Holidays</span>
                    <span className="font-medium">Email only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

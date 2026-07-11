import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, X, ArrowRight, HelpCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlanButton } from '@/components/pricing/plan-button'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Affordable pricing plans for Australian care professionals. Start with a 14-day free trial. No credit card required.',
}

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started with the basics',
    popular: false,
    color: 'border-gray-200',
    buttonVariant: 'outline' as const,
    features: {
      'AI Documents': '1/month',
      'Shift Notes': '3/month',
      'Resource Library': 'Limited',
      'Training Courses': '1 free course',
      'Burnout Assessment': true,
      'PDF Downloads': false,
      'Team Management': false,
      'Priority Support': false,
      'Certificates': false,
      'Custom Templates': false,
    },
  },
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Perfect for individual carers',
    popular: false,
    color: 'border-gray-200',
    buttonVariant: 'default' as const,
    features: {
      'AI Documents': '5/month',
      'Shift Notes': '10/month',
      'Resource Library': 'Full access',
      'Training Courses': '3 courses',
      'Burnout Assessment': true,
      'PDF Downloads': true,
      'Team Management': false,
      'Priority Support': false,
      'Certificates': false,
      'Custom Templates': false,
    },
  },
  {
    name: 'Professional',
    price: 79,
    period: 'month',
    description: 'For dedicated care professionals',
    popular: true,
    color: 'border-teal-500',
    buttonVariant: 'primary' as const,
    features: {
      'AI Documents': '50/month',
      'Shift Notes': 'Unlimited',
      'Resource Library': 'Full access',
      'Training Courses': 'All courses',
      'Burnout Assessment': true,
      'PDF Downloads': true,
      'Team Management': 'Up to 5 users',
      'Priority Support': true,
      'Certificates': true,
      'Custom Templates': false,
    },
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For organisations and teams',
    popular: false,
    color: 'border-gray-200',
    buttonVariant: 'secondary' as const,
    features: {
      'AI Documents': 'Unlimited',
      'Shift Notes': 'Unlimited',
      'Resource Library': 'Full + custom',
      'Training Courses': 'All + custom',
      'Burnout Assessment': true,
      'PDF Downloads': true,
      'Team Management': 'Unlimited users',
      'Priority Support': 'Dedicated manager',
      'Certificates': true,
      'Custom Templates': true,
    },
  },
]

const featureRows = [
  'AI Documents',
  'Shift Notes',
  'Resource Library',
  'Training Courses',
  'Burnout Assessment',
  'PDF Downloads',
  'Team Management',
  'Priority Support',
  'Certificates',
  'Custom Templates',
]

const faqs = [
  {
    q: 'Is there a free trial available?',
    a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can upgrade, downgrade, or cancel at any time during your trial.',
  },
  {
    q: 'Can I change plans at any time?',
    a: "Absolutely. You can upgrade or downgrade your plan at any time. When you upgrade, the change takes effect immediately. When you downgrade, it takes effect at the end of your current billing period.",
  },
  {
    q: 'Do you offer discounts for organisations?',
    a: 'Yes, we offer significant discounts for organisations with multiple users, not-for-profit organisations, and government-funded care providers. Contact our sales team to discuss your needs.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use bank-grade encryption, are ISO 27001 certified, and comply with the Australian Privacy Act. Your data is stored in Australian data centres and never shared with third parties.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express), direct debit via Australian bank accounts, and invoice payment for Enterprise customers.',
  },
  {
    q: 'Are prices GST inclusive?',
    a: 'Yes, all prices shown are GST inclusive. We are registered for GST and provide compliant tax invoices for all transactions.',
  },
]

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircle className="h-5 w-5 text-teal-500 mx-auto" />
  if (value === false) return <X className="h-5 w-5 text-gray-300 mx-auto" />
  return <span className="text-sm text-gray-700 text-center block">{value}</span>
}

export default function PricingPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">Transparent Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Honest Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. All plans include a 14-day trial with no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border-2 ${plan.color} ${plan.popular ? 'shadow-xl scale-105' : 'shadow-sm'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 mb-1">/{plan.period}</span>
                      )}
                    </div>
                    {plan.price > 0 && (
                      <p className="text-xs text-gray-400 mt-1">per user · GST included</p>
                    )}
                  </div>
                  <PlanButton
                    planName={plan.name}
                    price={plan.price}
                    buttonVariant={plan.buttonVariant}
                  />
                  <ul className="space-y-2.5">
                    {featureRows.map((feature) => (
                      <li key={feature} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">{feature}</span>
                        <FeatureValue value={plan.features[feature as keyof typeof plan.features]} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            Need a custom plan?{' '}
            <Link href="/contact" className="text-teal-600 hover:underline font-medium">
              Contact our sales team →
            </Link>
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Full Feature Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 w-1/3">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className={`py-4 px-4 text-sm font-semibold text-center ${plan.popular ? 'text-teal-600' : 'text-gray-600'}`}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((feature, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{feature}</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="py-3 px-4">
                        <FeatureValue value={plan.features[feature as keyof typeof plan.features]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Something Bigger?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            We work with large aged care organisations, disability service providers, and government agencies. Custom pricing, white-labelling, and integrations available.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              'Custom user limits',
              'Single sign-on (SSO)',
              'Advanced analytics',
              'Custom AI templates',
              'Dedicated support',
              'SLA guarantee',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-3">
                <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/contact">
            <Button size="lg" variant="primary">
              Talk to Sales
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Can&apos;t find your answer? <Link href="/contact" className="text-teal-600 hover:underline">Contact us</Link></p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money back guarantee */}
      <section className="py-12 bg-teal-50 border-t border-teal-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-gray-600">
            Not satisfied? We&apos;ll refund your first month&apos;s payment, no questions asked. We&apos;re that confident you&apos;ll love Scribe & Thrive Australia.
          </p>
        </div>
      </section>
    </div>
  )
}

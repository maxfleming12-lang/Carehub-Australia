import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { ArrowRight, Clock, ClipboardCheck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = pageMetadata({
  title: "Assessments",
  description:
    "Evidence-based assessments for Australian care workers. Burnout assessment, wellbeing checks, and more.",
  path: "/assessments",
})

export default function AssessmentsPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-orange-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            Wellbeing Tools
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Care Worker Assessments
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tools to help you understand and improve wellbeing, compliance knowledge, and professional effectiveness.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="card-hover overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-100 text-green-700">Available</Badge>
                    <Badge variant="outline">Free</Badge>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Carer Burnout Assessment
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    A 15-question screening tool adapted for Australian care workers. It calculates a burnout risk level and provides support recommendations.
                  </p>
                </div>
                <Link href="/assessments/burnout" className="md:flex-shrink-0">
                  <Button variant="primary" className="w-full md:w-auto">
                    Start Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: Clock, label: '5 minutes', desc: 'Quick to complete' },
                  { icon: ClipboardCheck, label: '15 questions', desc: 'Structured screening' },
                  { icon: ShieldCheck, label: 'Private result', desc: 'No public sharing' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-4">
                    <Icon className="h-5 w-5 text-orange-600 mb-2" />
                    <div className="font-semibold text-gray-900 text-sm">{label}</div>
                    <div className="text-xs text-gray-500 mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Regular Assessments Matter
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Early Identification',
                desc: 'Catch burnout and stress before they become serious health issues.',
              },
              {
                title: 'Track Progress',
                desc: 'Use regular checks to understand changes in your wellbeing over time.',
              },
              {
                title: 'Targeted Support',
                desc: 'Receive recommendations based on your assessment result.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Assessments',
  description:
    'Evidence-based assessments for Australian care workers. Burnout assessment, wellbeing checks, and more.',
}

const assessments = [
  {
    title: 'Carer Burnout Assessment',
    description:
      'A scientifically validated 15-question assessment based on the Maslach Burnout Inventory, adapted for Australian care workers. Get personalised recommendations based on your results.',
    duration: '5 minutes',
    questions: 15,
    participants: '8,200+',
    tags: ['Wellbeing', 'Mental Health', 'NDIS', 'Free'],
    href: '/assessments/burnout',
    emoji: '❤️',
    available: true,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Compassion Fatigue Screening',
    description:
      'Assess your level of compassion fatigue and secondary traumatic stress. Receive targeted strategies to restore your empathy and resilience.',
    duration: '8 minutes',
    questions: 20,
    participants: '3,100+',
    tags: ['Wellbeing', 'Trauma', 'Professionals'],
    href: '/assessments/compassion-fatigue',
    emoji: '💙',
    available: false,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Workplace Stress Index',
    description:
      'Measure key workplace stressors including workload, relationships, control, and organisational support. Identify your highest risk areas.',
    duration: '6 minutes',
    questions: 18,
    participants: '2,400+',
    tags: ['Workplace', 'Stress', 'Management'],
    href: '/assessments/workplace-stress',
    emoji: '📊',
    available: false,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'NDIS Knowledge Check',
    description:
      'Test your understanding of NDIS principles, practice standards, and participant rights. Perfect for onboarding and annual compliance reviews.',
    duration: '10 minutes',
    questions: 25,
    participants: '5,600+',
    tags: ['NDIS', 'Compliance', 'Training'],
    href: '/assessments/ndis-knowledge',
    emoji: '📚',
    available: false,
    color: 'from-teal-500 to-green-500',
  },
]

export default function AssessmentsPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-orange-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            Wellbeing Tools
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Care Worker Assessments
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Evidence-based tools to help you understand and improve your wellbeing, compliance knowledge, and professional effectiveness.
          </p>
        </div>
      </section>

      {/* Assessments Grid */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {assessments.map((assessment) => (
              <Card key={assessment.title} className={`card-hover overflow-hidden ${!assessment.available ? 'opacity-75' : ''}`}>
                <div className={`h-1.5 bg-gradient-to-r ${assessment.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{assessment.emoji}</div>
                    <div className="flex gap-2">
                      {assessment.available ? (
                        <Badge className="bg-green-100 text-green-700">Available</Badge>
                      ) : (
                        <Badge variant="outline">Coming Soon</Badge>
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{assessment.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{assessment.description}</p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-teal-500" />
                      {assessment.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-teal-500" />
                      {assessment.participants} completed
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {assessment.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {assessment.available ? (
                    <Link href={assessment.href}>
                      <Button variant="primary" className="w-full">
                        Start Assessment
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why use assessments */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Regular Assessments Matter
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: '🔍',
                title: 'Early Identification',
                desc: 'Catch burnout and stress before they become serious health issues. Early intervention is far more effective than crisis response.',
              },
              {
                emoji: '📈',
                title: 'Track Progress',
                desc: 'Monitor your wellbeing over time and see the impact of support strategies with regular reassessments.',
              },
              {
                emoji: '🎯',
                title: 'Targeted Support',
                desc: "Receive personalised recommendations based on your specific assessment results, not generic advice.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50">
                <div className="text-3xl mb-3">{item.emoji}</div>
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Users, Star, Award, ArrowRight, BookOpen, CheckCircle, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Training Courses',
  description:
    'Accredited CPD training courses for Australian care workers. NDIS, aged care, mental health, manual handling and more.',
}

const courses = [
  {
    id: 1,
    title: 'NDIS Fundamentals for Support Workers',
    description: 'Essential knowledge for anyone working in the NDIS sector. Covers NDIS principles, participant rights, quality and safeguarding, and your role as a support worker.',
    duration: '4 hours',
    modules: 8,
    level: 'Beginner',
    category: 'NDIS',
    enrolled: 3240,
    rating: 4.9,
    reviews: 287,
    tier: 'free',
    color: 'from-teal-500 to-cyan-500',
    certificate: true,
    topics: ['NDIS overview', 'Participant rights', 'Practice standards', 'Safeguarding', 'Documentation'],
  },
  {
    id: 2,
    title: 'Safe Manual Handling in Care Settings',
    description: 'Practical training on safe manual handling techniques to prevent injury when assisting with mobility, transfers, and repositioning in home and residential care settings.',
    duration: '2 hours',
    modules: 5,
    level: 'All Levels',
    category: 'Health & Safety',
    enrolled: 5120,
    rating: 4.8,
    reviews: 412,
    tier: 'free',
    color: 'from-blue-500 to-indigo-500',
    certificate: true,
    topics: ['Body mechanics', 'Risk assessment', 'Transfer techniques', 'Equipment use', 'Injury prevention'],
  },
  {
    id: 3,
    title: 'Mental Health First Aid for Carers',
    description: 'Learn how to recognise and respond to mental health crises, support participants with mental health conditions, and maintain your own mental wellbeing.',
    duration: '6 hours',
    modules: 10,
    level: 'Intermediate',
    category: 'Mental Health',
    enrolled: 2860,
    rating: 4.9,
    reviews: 198,
    tier: 'starter',
    color: 'from-purple-500 to-pink-500',
    certificate: true,
    topics: ['Mental health conditions', 'Crisis response', 'Suicide awareness', 'Recovery approach', 'Self-care'],
  },
  {
    id: 4,
    title: 'Medication Administration & Management',
    description: 'Comprehensive training on safe medication administration for care workers. Covers medication types, administration routes, documentation, and error management.',
    duration: '3 hours',
    modules: 7,
    level: 'Intermediate',
    category: 'Clinical',
    enrolled: 2100,
    rating: 4.7,
    reviews: 156,
    tier: 'starter',
    color: 'from-green-500 to-emerald-500',
    certificate: true,
    topics: ['Medication types', 'Safe administration', 'Documentation', 'Storage', 'Error reporting'],
  },
  {
    id: 5,
    title: 'Positive Behaviour Support',
    description: 'Learn evidence-based approaches to understanding and supporting people with challenging behaviour. Covers the NDIS Behaviour Support Rules and positive strategies.',
    duration: '5 hours',
    modules: 9,
    level: 'Intermediate',
    category: 'NDIS',
    enrolled: 1450,
    rating: 4.8,
    reviews: 94,
    tier: 'professional',
    color: 'from-orange-500 to-amber-500',
    certificate: true,
    topics: ['Behaviour understanding', 'Functional assessment', 'PBS strategies', 'Restrictive practices', 'Documentation'],
  },
  {
    id: 6,
    title: 'Aged Care Quality Standards Masterclass',
    description: 'Deep-dive training on all 8 Aged Care Quality Standards. Includes compliance assessment, evidence requirements, and continuous improvement strategies.',
    duration: '8 hours',
    modules: 12,
    level: 'Advanced',
    category: 'Aged Care',
    enrolled: 980,
    rating: 4.9,
    reviews: 76,
    tier: 'professional',
    color: 'from-red-500 to-rose-500',
    certificate: true,
    topics: ['Quality Standards', 'Consumer dignity', 'Safe care', 'Clinical governance', 'Continuous improvement'],
  },
]

const levelColor: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'All Levels': 'bg-blue-100 text-blue-700',
  'Intermediate': 'bg-yellow-100 text-yellow-700',
  'Advanced': 'bg-red-100 text-red-700',
}

const tierLabel: Record<string, { label: string; class: string }> = {
  free: { label: 'Free', class: 'bg-green-100 text-green-700' },
  starter: { label: 'Starter', class: 'bg-blue-100 text-blue-700' },
  professional: { label: 'Professional', class: 'bg-purple-100 text-purple-700' },
}

export default function TrainingPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">CPD Certified</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Professional Training Courses</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advance your skills with accredited courses designed for Australian care professionals. Earn certificates of completion for your CPD portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            {[
              { icon: BookOpen, label: '18+ Courses' },
              { icon: Award, label: 'CPD Certificates' },
              { icon: Users, label: '15,000+ Enrolled' },
              { icon: Star, label: '4.8★ Average Rating' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-gray-300">
                <Icon className="h-4 w-4 text-blue-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isLocked = course.tier !== 'free'
              return (
                <Card key={course.id} className="card-hover overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColor[course.level] || 'bg-gray-100 text-gray-700'}`}>
                          {course.level}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tierLabel[course.tier].class}`}>
                          {isLocked && <Lock className="h-3 w-3" />}
                          {tierLabel[course.tier].label}
                        </span>
                      </div>
                    </div>
                    <h2 className="font-bold text-gray-900 mb-2 leading-snug">{course.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{course.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</div>
                      <div className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.modules} modules</div>
                      <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.enrolled.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{course.rating} ({course.reviews} reviews)</span>
                    </div>
                    {course.certificate && (
                      <div className="flex items-center gap-1.5 text-xs text-teal-600 mb-4">
                        <Award className="h-3.5 w-3.5" />
                        Certificate of completion included
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs py-0">{topic}</Badge>
                      ))}
                      {course.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs py-0">+{course.topics.length - 3} more</Badge>
                      )}
                    </div>
                    {isLocked ? (
                      <Button variant="outline" size="sm" className="w-full">
                        <Lock className="h-3.5 w-3.5" />
                        Unlock with {tierLabel[course.tier].label} Plan
                      </Button>
                    ) : (
                      <Link href={`/training/${course.id}`}>
                        <Button variant="primary" size="sm" className="w-full">
                          Start Free Course
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Start Learning Today</h2>
          <p className="text-blue-100 mb-6">
            Access 2 free courses with no registration required. Upgrade to unlock all courses and earn CPD certificates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="white">Start Free Trial <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">View Pricing</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

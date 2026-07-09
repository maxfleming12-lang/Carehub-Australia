import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Lock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: 'Training Courses',
  description:
    'Published training courses for Australian care workers. NDIS, aged care, mental health, manual handling and more.',
}

type Course = Pick<
  Database['public']['Tables']['courses']['Row'],
  | 'id'
  | 'title'
  | 'description'
  | 'duration_hours'
  | 'level'
  | 'category'
  | 'access_tier'
  | 'certificate_enabled'
>

const levelColor: Record<Course['level'], string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

const tierLabel: Record<Course['access_tier'], { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-green-100 text-green-700' },
  starter: { label: 'Starter', className: 'bg-blue-100 text-blue-700' },
  professional: { label: 'Professional', className: 'bg-purple-100 text-purple-700' },
  enterprise: { label: 'Enterprise', className: 'bg-gray-900 text-white' },
}

function formatLevel(level: Course['level']) {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

function formatDuration(hours: number) {
  if (hours === 1) {
    return '1 hour'
  }

  return `${hours} hours`
}

export default async function TrainingPage() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, duration_hours, level, category, access_tier, certificate_enabled')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const courses = data ?? []
  const categoryCount = new Set(courses.map((course) => course.category)).size
  const certificateCount = courses.filter((course) => course.certificate_enabled).length

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Training
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Training Courses
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Published training for Australian care professionals, with access controlled by your account plan.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            {[
              { icon: BookOpen, label: `${courses.length} published` },
              { icon: GraduationCap, label: `${categoryCount} categories` },
              { icon: Award, label: `${certificateCount} certificate-enabled` },
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
          {error ? (
            <Card>
              <CardContent className="p-10 text-center">
                <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900">Training could not be loaded</h2>
                <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <GraduationCap className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">No training published yet</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Approved courses will appear here once training modules are published.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const isLocked = course.access_tier !== 'free'

                return (
                  <Card key={course.id} className="card-hover overflow-hidden group">
                    <div className="h-2 bg-gradient-to-r from-teal-500 to-blue-500" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColor[course.level]}`}>
                            {formatLevel(course.level)}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tierLabel[course.access_tier].className}`}>
                            {isLocked && <Lock className="h-3 w-3" />}
                            {tierLabel[course.access_tier].label}
                          </span>
                        </div>
                      </div>
                      <h2 className="font-bold text-gray-900 mb-2 leading-snug">{course.title}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(course.duration_hours)}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.category}
                        </div>
                      </div>
                      {course.certificate_enabled && (
                        <div className="flex items-center gap-1.5 text-xs text-teal-600 mb-4">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Certificate enabled
                        </div>
                      )}
                      {isLocked ? (
                        <Link href="/pricing">
                          <Button variant="outline" size="sm" className="w-full">
                            <Lock className="h-3.5 w-3.5" />
                            View Access Plans
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Course Content Pending
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Training Access</h2>
          <p className="text-blue-100 mb-6">
            Sign in to track your training progress and view course access for your plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login?next=/training">
              <Button size="lg" variant="white">Sign In</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

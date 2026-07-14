import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Database, Json } from '@/types/database'

type CoursePageProps = {
  params: Promise<{ id: string }>
}

type Course = Pick<
  Database['public']['Tables']['courses']['Row'],
  | 'id'
  | 'title'
  | 'description'
  | 'content'
  | 'duration_hours'
  | 'level'
  | 'category'
  | 'access_tier'
  | 'certificate_enabled'
>

type ProfileAccess = {
  role: 'user' | 'admin'
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise' | null
} | null

type CourseLesson = {
  title: string
  content?: string
}

type CourseModule = {
  title: string
  duration?: string
  summary?: string
  lessons: CourseLesson[]
}

function asRecord(value: Json): Record<string, Json | undefined> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value
}

function asString(value: Json | undefined) {
  return typeof value === 'string' ? value : ''
}

function asStringArray(value: Json | undefined) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

// Lessons were originally stored as plain title strings; newer content stores
// them as { title, content } objects. Support both shapes.
function asLessons(value: Json | undefined): CourseLesson[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (typeof item === 'string') {
      return [{ title: item }]
    }

    const lesson = asRecord(item)
    const title = asString(lesson?.title)

    if (!title) {
      return []
    }

    const content = asString(lesson?.content)
    return [{ title, content: content || undefined }]
  })
}

function asModules(value: Json | undefined): CourseModule[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item, index) => {
    const courseModule = asRecord(item)

    return {
      title: asString(courseModule?.title) || `Module ${index + 1}`,
      duration: asString(courseModule?.duration),
      summary: asString(courseModule?.summary),
      lessons: asLessons(courseModule?.lessons),
    }
  })
}

function parseCourseContent(content: Json) {
  const record = asRecord(content)

  return {
    overview: asString(record?.overview),
    learningOutcomes: asStringArray(record?.learningOutcomes),
    modules: asModules(record?.modules),
    practicalActivities: asStringArray(record?.practicalActivities),
    assessment: asString(record?.assessment),
    certificate: asString(record?.certificate),
  }
}

function formatLevel(level: Course['level']) {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

function formatDuration(hours: number) {
  return hours === 1 ? '1 hour' : `${hours} hours`
}

function canAccessCourse(course: Course, profile: ProfileAccess) {
  if (course.access_tier === 'free') {
    return true
  }

  if (!profile) {
    return false
  }

  if (profile.role === 'admin') {
    return true
  }

  const tierRank: Record<'free' | 'starter' | 'professional' | 'enterprise', number> = {
    free: 0,
    starter: 1,
    professional: 2,
    enterprise: 3,
  }

  return (tierRank[profile.subscription_tier ?? 'free'] ?? 0) >= tierRank[course.access_tier]
}

async function getCourse(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, description, content, duration_hours, level, category, access_tier, certificate_enabled')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()

  return course
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) {
    return { title: 'Course Not Found' }
  }

  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/training/${course.id}` },
  }
}

export default async function TrainingCoursePage({ params }: CoursePageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, description, content, duration_hours, level, category, access_tier, certificate_enabled')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()

  if (!course) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('role, subscription_tier')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  const content = parseCourseContent(course.content)
  const hasAccess = canAccessCourse(course, profile)

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/training" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to training
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30">{course.category}</Badge>
            <Badge className="bg-white/10 text-white border-white/20">{formatLevel(course.level)}</Badge>
            <Badge className="bg-white/10 text-white border-white/20">{course.access_tier}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">{course.description}</p>
          <div className="flex flex-wrap gap-5 mt-6 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-300" />
              {formatDuration(course.duration_hours)}
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-300" />
              {content.modules.length} modules
            </span>
            {course.certificate_enabled && (
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-300" />
                Certificate enabled
              </span>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {!hasAccess ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Lock className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">This course is included with a paid plan</h2>
              <p className="text-gray-500 mb-6">
                Sign in with an eligible account or upgrade to access the full course materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/auth/login?next=/training/${course.id}`}>
                  <Button variant="primary">Sign In</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline">View Plans</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Course Overview</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {content.overview || course.description}
                  </p>
                </CardContent>
              </Card>

              {content.modules.map((module, index) => (
                <Card key={`${module.title}-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-teal-600 mb-1">Module {index + 1}</p>
                        <h2 className="text-lg font-bold text-gray-900">{module.title}</h2>
                      </div>
                      {module.duration && (
                        <Badge variant="secondary">{module.duration}</Badge>
                      )}
                    </div>
                    {module.summary && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{module.summary}</p>
                    )}
                    {module.lessons.length > 0 && (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) =>
                          lesson.content ? (
                            <details
                              key={`${lesson.title}-${lessonIndex}`}
                              className="group rounded-lg border border-gray-200 bg-gray-50/50 open:bg-white"
                              open={index === 0 && lessonIndex === 0}
                            >
                              <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-800 hover:text-teal-700 [&::-webkit-details-marker]:hidden">
                                <BookOpen className="h-4 w-4 text-teal-500 flex-shrink-0" />
                                <span className="flex-1">{lesson.title}</span>
                                <span className="text-xs font-normal text-gray-400 group-open:hidden">Read lesson</span>
                              </summary>
                              <div className="border-t border-gray-100 px-4 py-4 space-y-3">
                                {lesson.content.split(/\n\n+/).map((paragraph, paragraphIndex) =>
                                  paragraph.trim().startsWith('- ') ? (
                                    <ul key={paragraphIndex} className="space-y-1.5">
                                      {paragraph.split('\n').map((line, lineIndex) => (
                                        <li key={lineIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                          <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                                          <span>{line.replace(/^- /, '')}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p key={paragraphIndex} className="text-sm text-gray-600 leading-relaxed">
                                      {paragraph}
                                    </p>
                                  )
                                )}
                              </div>
                            </details>
                          ) : (
                            <div key={`${lesson.title}-${lessonIndex}`} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                              <span>{lesson.title}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <aside className="space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h2 className="font-bold text-gray-900 mb-4">Learning Outcomes</h2>
                  <ul className="space-y-2">
                    {content.learningOutcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {content.practicalActivities.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h2 className="font-bold text-gray-900 mb-4">Practical Activities</h2>
                    <ul className="space-y-2">
                      {content.practicalActivities.map((activity) => (
                        <li key={activity} className="text-sm text-gray-600 leading-relaxed">
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {(content.assessment || content.certificate) && (
                <Card>
                  <CardContent className="p-5">
                    <h2 className="font-bold text-gray-900 mb-4">Completion</h2>
                    {content.assessment && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{content.assessment}</p>
                    )}
                    {content.certificate && (
                      <p className="text-sm text-gray-600 leading-relaxed">{content.certificate}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

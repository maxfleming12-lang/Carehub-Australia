import Link from 'next/link'
import {
  Heart,
  FileText,
  Brain,
  BookOpen,
  Shield,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Download,
  Award,
  Clock,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Registered Carers', value: '12,000+' },
  { label: 'Documents Generated', value: '85,000+' },
  { label: 'Training Completions', value: '42,000+' },
  { label: 'Satisfaction Rate', value: '98%' },
]

const features = [
  {
    icon: Brain,
    title: 'AI Document Builder',
    description: 'Generate NDIS-compliant care plans, support letters, incident reports and more in seconds using advanced AI.',
    href: '/ai-document-builder',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: FileText,
    title: 'Shift Note Creator',
    description: 'Create professional shift notes with AI assistance. Save time and ensure compliance with NDIS documentation standards.',
    href: '/shift-notes',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Heart,
    title: 'Burnout Assessment',
    description: 'Assess your burnout risk with our scientifically validated tool and receive personalised support recommendations.',
    href: '/assessments/burnout',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    icon: BookOpen,
    title: 'Training Courses',
    description: 'Access accredited CPD courses covering manual handling, medication, mental health, and NDIS compliance.',
    href: '/training',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Download,
    title: 'Resource Library',
    description: 'Download policy templates, checklists, guides, and toolkits designed specifically for Australian care settings.',
    href: '/resources',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Shield,
    title: 'Compliance Tools',
    description: 'Stay up-to-date with NDIS Practice Standards, Aged Care Quality Standards, and regulatory requirements.',
    href: '/resources',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Support Worker, Melbourne',
    quote: "Scribe & Thrive has completely transformed how I write shift notes. What used to take me 20 minutes now takes 3. The AI understands NDIS language perfectly.",
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James Nguyen',
    role: 'Care Manager, Brisbane',
    quote: "The resource library alone is worth the subscription. I've found policy templates that would have taken days to create ourselves. Brilliant platform.",
    rating: 5,
    avatar: 'JN',
  },
  {
    name: 'Dr. Rebecca Torres',
    role: 'Clinical Lead, Sydney',
    quote: "The burnout assessment tool is clinically sound and has helped us identify at-risk staff early. The training courses are excellent quality too.",
    rating: 5,
    avatar: 'RT',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for individual carers',
    popular: false,
    features: ['5 AI document generations/month', '10 shift notes/month', 'Resource library access', '3 training courses', 'Burnout assessment', 'Email support'],
  },
  {
    name: 'Professional',
    price: 79,
    description: 'For dedicated care professionals',
    popular: true,
    features: ['50 AI document generations/month', 'Unlimited shift notes', 'Full resource library', 'All training courses + certificates', 'Priority support', 'Team management (5 users)'],
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For organisations and teams',
    popular: false,
    features: ['Unlimited AI document generations', 'Custom templates', 'White-label options', 'Unlimited team members', 'Dedicated account manager', 'Custom integrations'],
  },
]

const awards = [
  { label: 'NDIS Provider Verified', icon: Shield },
  { label: 'Australian Made', icon: Heart },
  { label: 'ISO 27001 Certified', icon: Award },
  { label: 'WCAG 2.1 AA Accessible', icon: Users },
]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="hero-gradient relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-500/30 px-4 py-2 mb-6">
                <Zap className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-medium text-teal-300">Australia&apos;s #1 Care Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Empowering{' '}
                <span className="gradient-text">Australia&apos;s</span>{' '}
                Care Community
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                The all-in-one platform for NDIS and aged care professionals. Generate documents with AI, complete burnout assessments, access training, and download essential resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/auth/register">
                  <Button variant="primary" size="xl" className="w-full sm:w-auto">
                    Start Free 14-Day Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="white" size="xl" className="w-full sm:w-auto">View Pricing</Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-teal-400" /><span>No credit card required</span></div>
                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-teal-400" /><span>Cancel anytime</span></div>
                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-teal-400" /><span>NDIS compliant</span></div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">AI Document Builder</h3>
                    <Badge className="bg-teal-500/30 text-teal-300 border-0">Live Preview</Badge>
                  </div>
                  {['Care Plan Generated', 'NDIS Compliant', 'Review Ready'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-teal-500 text-white' : i === 1 ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${i === 0 ? 'bg-teal-400 w-full' : i === 1 ? 'bg-blue-400 w-3/4' : 'bg-green-400 w-1/2'}`} />
                        </div>
                      </div>
                      <span className="text-white/70 text-sm">{step}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-4 bg-white/10 rounded-xl">
                    <p className="text-white/80 text-sm leading-relaxed">
                      &ldquo;John demonstrates strong social skills and actively participates in community activities. Goals include increasing independence in daily living tasks...&rdquo;
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 rounded-lg bg-teal-500/30 border border-teal-500/40 flex items-center justify-center text-teal-300 text-sm font-medium">Download PDF</div>
                    <div className="flex-1 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/70 text-sm font-medium">Edit Document</div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                    <div><div className="text-sm font-bold text-gray-900">85,000+</div><div className="text-xs text-gray-500">Documents Created</div></div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-600" /></div>
                    <div><div className="text-sm font-bold text-gray-900">Save 3+ hrs/week</div><div className="text-xs text-gray-500">On documentation</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-6">Trusted by carers and organisations across Australia</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {awards.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 text-gray-600">
                <Icon className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4">Everything You Need</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tools Built for Australian Care Professionals</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Every feature designed with NDIS compliance and Australian care standards in mind.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full card-hover group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{feature.description}</p>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${feature.color}`}>
                      Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Australia&apos;s Care Professionals</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Simple Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Plans for Every Carer</h2>
            <p className="text-lg text-gray-500">All plans include a 14-day free trial. No credit card required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-2 border-teal-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">Most Popular</span>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register">
                    <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">Start Free Trial</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            All prices in AUD. GST inclusive.{' '}
            <Link href="/pricing" className="text-teal-600 hover:underline">View full pricing details →</Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Care Practice?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Join 12,000+ Australian care professionals who trust Scribe & Thrive to make their work easier, faster, and more compliant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="xl" variant="white">Start Free 14-Day Trial <ArrowRight className="h-5 w-5" /></Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white/10">Talk to Our Team</Button>
            </Link>
          </div>
          <p className="text-teal-200 text-sm mt-6">No credit card required · Cancel anytime · Australian-based support</p>
        </div>
      </section>
    </div>
  )
}

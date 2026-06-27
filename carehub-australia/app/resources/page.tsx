import type { Metadata } from 'next'
import { Download, Search, Lock, FileText, BookOpen, Clipboard, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Download free and premium resources for Australian care workers. Policy templates, checklists, guides and toolkits.',
}

const categories = [
  { name: 'All', count: 48, icon: FileText },
  { name: 'NDIS', count: 16, icon: Shield },
  { name: 'Aged Care', count: 12, icon: BookOpen },
  { name: 'Templates', count: 10, icon: Clipboard },
  { name: 'Guides', count: 10, icon: BookOpen },
]

const resources = [
  {
    title: 'NDIS Support Worker Induction Pack',
    description: 'Complete onboarding package for new NDIS support workers. Includes role overview, participant rights, code of conduct, and key contacts.',
    category: 'NDIS',
    tier: 'free',
    type: 'PDF Pack',
    pages: 24,
    downloads: 3420,
    emoji: '📋',
  },
  {
    title: 'Incident Report Template (NDIS)',
    description: 'NDIS-compliant incident report template with guidance notes. Covers all required fields and aligns with NDIS Commission reporting requirements.',
    category: 'NDIS',
    tier: 'free',
    type: 'Word Document',
    pages: 4,
    downloads: 5120,
    emoji: '⚠️',
  },
  {
    title: 'Medication Management Policy Template',
    description: 'Comprehensive medication management policy for care organisations. Includes risk assessment, administration protocols, and error reporting procedures.',
    category: 'Templates',
    tier: 'starter',
    type: 'PDF + Word',
    pages: 18,
    downloads: 1890,
    emoji: '💊',
  },
  {
    title: 'NDIS Participant Rights Handbook',
    description: "Plain English guide to NDIS participant rights, NDIS Act obligations, and how to support participants to understand and exercise their rights.",
    category: 'NDIS',
    tier: 'free',
    type: 'PDF Guide',
    pages: 12,
    downloads: 4300,
    emoji: '⚖️',
  },
  {
    title: 'Aged Care Quality Standards Checklist',
    description: 'Comprehensive self-assessment checklist against all 8 Aged Care Quality Standards. Includes evidence requirements and improvement planning templates.',
    category: 'Aged Care',
    tier: 'starter',
    type: 'Excel Spreadsheet',
    pages: 35,
    downloads: 2100,
    emoji: '✅',
  },
  {
    title: 'Manual Handling Risk Assessment Tool',
    description: 'Systematic risk assessment framework for manual handling tasks in care settings. Includes body map, risk rating matrix, and control measures.',
    category: 'Templates',
    tier: 'free',
    type: 'PDF Tool',
    pages: 8,
    downloads: 6750,
    emoji: '🏋️',
  },
  {
    title: 'Behaviour Support Plan Template',
    description: 'Comprehensive positive behaviour support plan template aligned with NDIS Behaviour Support Rules. Includes functional behaviour assessment tools.',
    category: 'NDIS',
    tier: 'professional',
    type: 'PDF + Word',
    pages: 20,
    downloads: 890,
    emoji: '🧩',
  },
  {
    title: 'Care Plan Review Framework',
    description: 'Structured framework for regular care plan reviews. Includes participant goals review, progress assessment, and plan update process.',
    category: 'Templates',
    tier: 'starter',
    type: 'PDF Guide',
    pages: 14,
    downloads: 1560,
    emoji: '📝',
  },
  {
    title: 'Restrictive Practices Decision-Making Guide',
    description: 'Comprehensive guide to restrictive practices under the NDIS, including authorisation processes, least restrictive alternatives, and monitoring requirements.',
    category: 'NDIS',
    tier: 'professional',
    type: 'PDF Guide',
    pages: 30,
    downloads: 720,
    emoji: '🚫',
  },
  {
    title: 'Carer Self-Care Action Plan Workbook',
    description: 'Personal development workbook for care workers to create their own wellbeing and self-care plan. Evidence-based strategies for preventing burnout.',
    category: 'Guides',
    tier: 'free',
    type: 'PDF Workbook',
    pages: 22,
    downloads: 3890,
    emoji: '🌱',
  },
  {
    title: 'Home Care Package Policy Manual',
    description: 'Complete policy manual template for home care package providers. Covers all regulatory requirements, service agreements, and consumer directed care.',
    category: 'Aged Care',
    tier: 'professional',
    type: 'Word Document',
    pages: 85,
    downloads: 450,
    emoji: '🏠',
  },
  {
    title: 'Supported Decision Making Toolkit',
    description: 'Practical toolkit for implementing supported decision making for NDIS participants. Includes conversation guides, documentation templates, and training activities.',
    category: 'NDIS',
    tier: 'starter',
    type: 'PDF Pack',
    pages: 28,
    downloads: 1230,
    emoji: '🤝',
  },
]

const tierBadge = {
  free: { label: 'Free', class: 'bg-green-100 text-green-700' },
  starter: { label: 'Starter+', class: 'bg-blue-100 text-blue-700' },
  professional: { label: 'Professional', class: 'bg-purple-100 text-purple-700' },
}

export default function ResourcesPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-green-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
            Resource Library
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Essential Care Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Download policy templates, guides, toolkits, and checklists designed specifically for Australian care organisations and professionals.
          </p>
        </div>
      </section>

      {/* Search bar */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:border-teal-500 hover:text-teal-600 transition-colors"
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.name}
                <span className="text-xs text-gray-400">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => {
              const tier = tierBadge[resource.tier as keyof typeof tierBadge]
              const isLocked = resource.tier !== 'free'
              return (
                <Card key={resource.title} className="card-hover group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">{resource.emoji}</div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tier.class}`}>
                          {isLocked && <Lock className="h-3 w-3" />}
                          {tier.label}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                      <span>{resource.type}</span>
                      <span>•</span>
                      <span>{resource.pages} pages</span>
                      <span>•</span>
                      <span>{resource.downloads.toLocaleString()} downloads</span>
                    </div>
                    <Badge variant="outline" className="text-xs mb-3">{resource.category}</Badge>
                    <div className="mt-3">
                      {isLocked ? (
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Lock className="h-3 w-3" />
                          Upgrade to Download
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" className="w-full text-xs">
                          <Download className="h-3 w-3" />
                          Download Free
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Load more */}
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">
              Load More Resources
            </Button>
            <p className="text-sm text-gray-400 mt-3">
              Showing 12 of 48 resources.{' '}
              <a href="/auth/register" className="text-teal-600 hover:underline">
                Sign up to see all
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Unlock the Full Resource Library
          </h2>
          <p className="text-teal-100 mb-6">
            Get access to 48+ premium resources, including policy manuals, behaviour support templates, and compliance toolkits. From $29/month.
          </p>
          <a href="/pricing">
            <Button size="lg" variant="white">
              See Pricing Plans
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}

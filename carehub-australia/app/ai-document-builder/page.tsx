'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, RefreshCw, Copy, CheckCircle, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const documentTypes = [
  { id: 'care_plan', label: 'NDIS Care Plan', icon: '📋', tier: 'starter' },
  { id: 'support_letter', label: 'Support Letter', icon: '✉️', tier: 'starter' },
  { id: 'incident_report', label: 'Incident Report', icon: '⚠️', tier: 'free' },
  { id: 'handover_notes', label: 'Handover Notes', icon: '📝', tier: 'free' },
  { id: 'behaviour_plan', label: 'Behaviour Support Plan', icon: '🧩', tier: 'professional' },
  { id: 'risk_assessment', label: 'Risk Assessment', icon: '🔍', tier: 'starter' },
  { id: 'goal_plan', label: 'Goal Setting Plan', icon: '🎯', tier: 'starter' },
  { id: 'discharge_summary', label: 'Discharge Summary', icon: '🏥', tier: 'professional' },
]

type ContextKey = 'clientName' | 'clientAge' | 'diagnosis' | 'goals' | 'additionalContext'

export default function AIDocumentBuilderPage() {
  const [selectedType, setSelectedType] = useState('care_plan')
  const [context, setContext] = useState<Record<ContextKey, string>>({
    clientName: '',
    clientAge: '',
    diagnosis: '',
    goals: '',
    additionalContext: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      const { supabase } = await createSupabaseBrowserClient()
      const {
        data: { session },
      } = supabase ? await supabase.auth.getSession() : { data: { session: null } }

      if (mounted) {
        setIsLoggedIn(Boolean(session?.user))
        setAuthReady(true)
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login?next=/ai-document-builder'
      return
    }

    if (!context.goals.trim() && !context.additionalContext.trim()) {
      setError('Add goals, support needs, or other context before generating.')
      return
    }

    setGenerating(true)
    setGenerated(false)
    setError('')

    try {
      const { supabase, error: configError } = await createSupabaseBrowserClient()

      if (configError || !supabase) {
        throw new Error(configError)
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = '/auth/login?next=/ai-document-builder'
        return
      }

      setIsLoggedIn(true)

      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: selectedType,
          title: `${selectedDoc?.label || 'Document'} - ${new Date().toLocaleDateString('en-AU')}`,
          context,
        }),
      })
      const result = (await response.json().catch(() => null)) as { content?: string; error?: string } | null

      if (!response.ok || !result?.content) {
        throw new Error(result?.error || 'Failed to generate document.')
      }

      setGeneratedContent(result.content)
      setGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate document.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedDoc = documentTypes.find((d) => d.id === selectedType)
  const isLocked = authReady && selectedDoc?.tier !== 'free' && !isLoggedIn

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 to-purple-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Document Builder</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate professional, NDIS-compliant care documents in seconds.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h2 className="font-bold text-gray-900 mb-4">1. Choose Document Type</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {documentTypes.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => { setSelectedType(doc.id); setGenerated(false) }}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center text-xs transition-all ${
                          selectedType === doc.id
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-teal-300 text-gray-600'
                        }`}
                      >
                        <span className="text-xl">{doc.icon}</span>
                        <span className="font-medium leading-tight">{doc.label}</span>
                        {doc.tier !== 'free' && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            doc.tier === 'starter' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                          }`}>{doc.tier}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h2 className="font-bold text-gray-900 mb-4">2. Provide Context</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Client Name (optional)</label>
                      <Input placeholder="Client name" value={context.clientName} onChange={(e) => setContext({ ...context, clientName: e.target.value })} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Age & Diagnosis</label>
                      <Input placeholder="e.g. 32yo, Autism Spectrum Disorder" value={context.diagnosis} onChange={(e) => setContext({ ...context, diagnosis: e.target.value })} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Goals / Key Information</label>
                      <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" rows={3} placeholder="Describe the main goals, support needs, or situation..." value={context.goals} onChange={(e) => setContext({ ...context, goals: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button variant="primary" size="lg" className="w-full" onClick={handleGenerate} disabled={generating}>
                {generating ? (<><RefreshCw className="h-4 w-4 animate-spin" />Generating...</>) : isLocked ? (<><Lock className="h-4 w-4" />Sign In to Generate</>) : (<><Zap className="h-4 w-4" />Generate Document</>)}
              </Button>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900">3. Your Document</h2>
                    {generated && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="default" size="sm"><Download className="h-4 w-4" />Download PDF</Button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {!generated && !generating && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <FileText className="h-16 w-16 text-gray-200 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">Your document will appear here</h3>
                      <p className="text-sm text-gray-400 max-w-xs">Select a document type, add context, then click &quot;Generate Document&quot;.</p>
                    </div>
                  )}

                  {generating && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="relative mb-6">
                        <div className="h-16 w-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
                        <Zap className="absolute inset-0 m-auto h-6 w-6 text-teal-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">AI is generating your document...</h3>
                      <p className="text-sm text-gray-400">Applying NDIS compliance checks and Australian care standards</p>
                    </div>
                  )}

                  {generated && (
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Document generated successfully</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-[600px] overflow-y-auto leading-relaxed">{generatedContent}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="py-12 bg-gradient-to-r from-teal-600 to-blue-600">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Generate Real Documents?</h2>
            <p className="text-teal-100 mb-6">Create a free account to generate your first document. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/register"><Button size="lg" variant="white">Create Free Account</Button></a>
              <a href="/pricing"><Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">View All Plans</Button></a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

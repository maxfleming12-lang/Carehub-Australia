'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, RefreshCw, Zap, CheckCircle, Copy, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type ShiftData = {
  clientName: string
  date: string
  startTime: string
  endTime: string
  activities: string
  observations: string
  mood: string
  incidents: string
  medications: string
  goals: string
}

export default function ShiftNotesPage() {
  const [formData, setFormData] = useState<ShiftData>({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    activities: '',
    observations: '',
    mood: '',
    incidents: '',
    medications: '',
    goals: '',
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
        data: { user },
      } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

      if (mounted) {
        setIsLoggedIn(Boolean(user))
        setAuthReady(true)
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  const updateField = (key: keyof ShiftData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login?next=/shift-notes'
      return
    }

    if (!formData.clientName || !formData.date || !formData.activities) {
      setError('Client name, date, and activities are required.')
      return
    }

    setGenerating(true)
    setGenerated(false)
    setError('')

    try {
      const response = await fetch('/api/ai/generate-shift-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = (await response.json().catch(() => null)) as { content?: string; error?: string } | null

      if (!response.ok || !result?.content) {
        throw new Error(result?.error || 'Failed to generate shift note.')
      }

      setGeneratedContent(result.content)
      setGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate shift note.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-teal-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shift Note Creator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate professional, NDIS-compliant shift notes in minutes. Enter key details and our AI creates comprehensive documentation.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-400" />
              Saves 15+ mins per shift
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              NDIS compliant language
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-teal-400" />
              Instant PDF download
            </div>
          </div>
        </div>
      </section>

      {/* Builder */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardContent className="p-5">
                  <h2 className="font-bold text-gray-900 mb-4">Shift Details</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Client Name *</label>
                      <Input
                        placeholder="Client full name"
                        value={formData.clientName}
                        onChange={(e) => updateField('clientName', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Date *</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Start Time *</label>
                        <Input
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => updateField('startTime', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">End Time *</label>
                        <Input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => updateField('endTime', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h2 className="font-bold text-gray-900 mb-4">Shift Content</h2>
                  <div className="space-y-3">
                    {[
                      { key: 'activities' as const, label: 'Activities Completed *', placeholder: 'What did you do during the shift?' },
                      { key: 'observations' as const, label: 'Observations', placeholder: 'What did you observe?' },
                      { key: 'mood' as const, label: 'Client Mood & Wellbeing', placeholder: 'How was the client today?' },
                      { key: 'goals' as const, label: 'Goals Progress', placeholder: 'Progress toward NDIS goals this shift...' },
                      { key: 'medications' as const, label: 'Medications (if applicable)', placeholder: 'Medications administered, time, dose...' },
                      { key: 'incidents' as const, label: 'Incidents / Concerns', placeholder: 'Any incidents or concerns? (Leave blank if none)' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{field.label}</label>
                        <textarea
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                          rows={2}
                          placeholder={field.placeholder}
                          value={formData[field.key]}
                          onChange={(e) => updateField(field.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    {!authReady || isLoggedIn ? 'Generate Shift Note' : 'Sign In to Generate'}
                  </>
                )}
              </Button>
            </div>

            {/* Output */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900">Generated Shift Note</h2>
                    {generated && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="default" size="sm">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
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
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">
                        Your shift note will appear here
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm">
                        Fill in the shift details on the left, then click &quot;Generate Shift Note&quot; to create a professional NDIS-compliant shift note.
                      </p>
                    </div>
                  )}

                  {generating && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="relative mb-6">
                        <div className="h-16 w-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
                        <Zap className="absolute inset-0 m-auto h-6 w-6 text-teal-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Creating shift note...</h3>
                      <p className="text-sm text-gray-400">Applying NDIS documentation standards</p>
                    </div>
                  )}

                  {generated && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Shift note generated</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-[600px] overflow-y-auto leading-relaxed">
                        {generatedContent}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

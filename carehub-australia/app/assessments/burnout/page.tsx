'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, RefreshCw, Phone, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateBurnoutScore } from '@/lib/utils'

const questions = [
  { id: 1, text: 'I feel emotionally drained from my work as a carer.', category: 'emotional' },
  { id: 2, text: 'I feel used up at the end of the day.', category: 'physical' },
  { id: 3, text: 'I feel fatigued when I get up in the morning and have to face another day on the job.', category: 'physical' },
  { id: 4, text: 'I can easily understand how the people I care for feel about things.', category: 'empathy', reversed: true },
  { id: 5, text: 'I feel I treat some people I care for as if they were impersonal objects.', category: 'depersonalisation' },
  { id: 6, text: 'Working with people all day is really a strain for me.', category: 'emotional' },
  { id: 7, text: 'I deal very effectively with the problems of the people I care for.', category: 'accomplishment', reversed: true },
  { id: 8, text: 'I feel burned out from my work.', category: 'emotional' },
  { id: 9, text: 'I feel I\'m positively influencing other people\'s lives through my work.', category: 'accomplishment', reversed: true },
  { id: 10, text: 'I\'ve become more callous toward people since I took this job.', category: 'depersonalisation' },
  { id: 11, text: 'I worry that this job is hardening me emotionally.', category: 'depersonalisation' },
  { id: 12, text: 'I feel very energetic.', category: 'physical', reversed: true },
  { id: 13, text: 'I feel frustrated by my job.', category: 'emotional' },
  { id: 14, text: 'I feel I\'m working too hard on my job.', category: 'physical' },
  { id: 15, text: 'I don\'t really care what happens to some of the people I care for.', category: 'depersonalisation' },
]

const scaleLabels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']

const levelColors = {
  low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
  moderate: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
  severe: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
}

const levelEmoji = { low: '✅', moderate: '⚠️', high: '🔶', severe: '🆘' }

export default function BurnoutAssessmentPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [result, setResult] = useState<ReturnType<typeof calculateBurnoutScore> | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQ] = value
    setAnswers(newAnswers)
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300)
    }
  }

  const handleSubmit = () => {
    const validAnswers = answers.map((a) => (a === -1 ? 0 : a))
    setResult(calculateBurnoutScore(validAnswers))
  }

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(-1))
    setCurrentQ(0)
    setResult(null)
    setShowIntro(true)
  }

  const answeredCount = answers.filter((a) => a !== -1).length
  const progress = (answeredCount / questions.length) * 100

  if (showIntro) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">❤️</div>
            <Badge variant="destructive" className="mb-4">Carer Wellbeing Tool</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Carer Burnout Assessment
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              This evidence-based tool helps you understand your current burnout risk level and provides personalised support recommendations tailored for Australian care workers.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '⏱️', label: '5 minutes', desc: 'Quick to complete' },
              { icon: '🔒', label: 'Confidential', desc: 'Your data is private' },
              { icon: '📋', label: '15 questions', desc: 'Validated scale' },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-orange-200 bg-orange-50 mb-8">
            <CardContent className="p-6">
              <p className="text-sm text-orange-800 leading-relaxed">
                <strong>Important:</strong> This assessment is a screening tool, not a clinical diagnosis. If you are experiencing a mental health crisis, please contact Lifeline on{' '}
                <strong>13 11 14</strong> (available 24/7) or Beyond Blue on{' '}
                <strong>1300 22 4636</strong>.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              size="xl"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setShowIntro(false)}
            >
              Start Assessment
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Based on the Maslach Burnout Inventory framework, adapted for Australian care workers.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (result) {
    const colors = levelColors[result.level]
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <Card className={`border-2 ${colors.border} ${colors.bg} mb-8`}>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">{levelEmoji[result.level]}</div>
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-4 ${colors.badge}`}>
                {result.level.charAt(0).toUpperCase() + result.level.slice(1)} Burnout Risk
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Score: {result.score}%</h2>
              <p className={`text-base ${colors.text} leading-relaxed max-w-xl mx-auto`}>
                {result.description}
              </p>

              {/* Score bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.level === 'low' ? 'bg-green-500' :
                      result.level === 'moderate' ? 'bg-yellow-500' :
                      result.level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Low Risk</span>
                  <span>Severe Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Personalised Recommendations</h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0 mt-0.5 ${
                      result.level === 'severe' ? 'bg-red-500' :
                      result.level === 'high' ? 'bg-orange-500' :
                      result.level === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Crisis resources */}
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-800 mb-3">Australian Support Resources</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: 'Lifeline', number: '13 11 14', desc: '24/7 crisis support' },
                  { name: 'Beyond Blue', number: '1300 22 4636', desc: 'Mental health support' },
                  { name: 'Carer Gateway', number: '1800 422 737', desc: 'Carer support services' },
                  { name: 'Head to Health', number: '1800 595 212', desc: 'Mental health advice' },
                ].map((resource) => (
                  <div key={resource.name} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-100">
                    <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{resource.name}: {resource.number}</div>
                      <div className="text-xs text-gray-500">{resource.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleReset} variant="outline" size="lg">
              <RefreshCw className="h-4 w-4" />
              Retake Assessment
            </Button>
            <a
              href="https://www.carergateway.gov.au"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="primary">
                Find Support Services
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQ]
  const isAnswered = answers[currentQ] !== -1

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
              </Badge>
            </div>
            <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">
              {question.text}
            </p>

            <div className="space-y-3">
              {scaleLabels.map((label, i) => (
                <button
                  key={label}
                  onClick={() => handleAnswer(i)}
                  className={`w-full flex items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    answers[currentQ] === i
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                    answers[currentQ] === i
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ] === i && (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-medium text-sm">{label}</span>
                    <span className="text-xs text-gray-400">{i}/4</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentQ === questions.length - 1 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
            >
              See My Results
              <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
              disabled={!isAnswered}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {answeredCount < questions.length && currentQ === questions.length - 1 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Please answer all questions to see your results ({questions.length - answeredCount} remaining)
          </p>
        )}
      </div>
    </div>
  )
}

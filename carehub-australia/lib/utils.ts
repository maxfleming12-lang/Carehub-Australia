import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function calculateBurnoutScore(answers: number[]): {
  score: number
  level: 'low' | 'moderate' | 'high' | 'severe'
  description: string
  recommendations: string[]
} {
  const total = answers.reduce((sum, val) => sum + val, 0)
  const maxScore = answers.length * 4
  const percentage = (total / maxScore) * 100

  if (percentage < 25) {
    return {
      score: Math.round(percentage),
      level: 'low',
      description: 'You are managing well. Continue your current self-care practices.',
      recommendations: [
        'Maintain your current work-life balance',
        'Continue regular self-care activities',
        'Stay connected with your support network',
        'Keep up regular check-ins with your wellbeing',
      ],
    }
  } else if (percentage < 50) {
    return {
      score: Math.round(percentage),
      level: 'moderate',
      description: 'You are showing some signs of stress. It\'s time to take action.',
      recommendations: [
        'Schedule regular breaks throughout your day',
        'Practice mindfulness or meditation',
        'Speak with a trusted colleague or supervisor',
        'Consider accessing Employee Assistance Program (EAP)',
        'Review your workload with your manager',
      ],
    }
  } else if (percentage < 75) {
    return {
      score: Math.round(percentage),
      level: 'high',
      description: 'You are experiencing significant burnout. Please seek support.',
      recommendations: [
        'Immediately speak with your supervisor about workload',
        'Contact your EAP for professional support',
        'Consider taking planned leave',
        'Speak with your GP about your mental health',
        'Connect with Beyond Blue (1300 22 4636) or Lifeline (13 11 14)',
        'Review and reduce non-essential commitments',
      ],
    }
  } else {
    return {
      score: Math.round(percentage),
      level: 'severe',
      description: 'Critical burnout detected. Immediate action is required.',
      recommendations: [
        'Contact your GP immediately',
        'Call Lifeline: 13 11 14 (available 24/7)',
        'Call Beyond Blue: 1300 22 4636',
        'Take immediate leave if possible',
        'Inform your employer you need urgent support',
        'Reach out to family or trusted friends',
        'Consider professional counselling',
      ],
    }
  }
}

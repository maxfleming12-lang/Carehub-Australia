'use client'

import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const subjects = [
  'General enquiry',
  'Sales / pricing',
  'Technical support',
  'Account billing',
  'Feature request',
  'Partnership enquiry',
  'NDIS / regulatory question',
]

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisation: '',
    subject: '',
    message: '',
  })

  function updateField(key: keyof typeof formData, value: string) {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const subject = formData.subject || 'Website enquiry'
    const body = [
      `Name: ${formData.firstName} ${formData.lastName}`.trim(),
      `Email: ${formData.email}`,
      formData.phone ? `Phone: ${formData.phone}` : '',
      formData.organisation ? `Organisation: ${formData.organisation}` : '',
      '',
      formData.message,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:hello@sataus.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-first-name" className="text-sm font-medium text-gray-700 block mb-1.5">First Name *</label>
          <Input
            id="contact-first-name"
            placeholder="Jane"
            value={formData.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-last-name" className="text-sm font-medium text-gray-700 block mb-1.5">Last Name *</label>
          <Input
            id="contact-last-name"
            placeholder="Smith"
            value={formData.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm font-medium text-gray-700 block mb-1.5">Email Address *</label>
        <Input
          id="contact-email"
          type="email"
          placeholder="jane@organisation.com.au"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="text-sm font-medium text-gray-700 block mb-1.5">Phone (optional)</label>
        <Input
          id="contact-phone"
          type="tel"
          placeholder="0400 000 000"
          value={formData.phone}
          onChange={(event) => updateField('phone', event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="contact-organisation" className="text-sm font-medium text-gray-700 block mb-1.5">Organisation</label>
        <Input
          id="contact-organisation"
          placeholder="Your organisation name"
          value={formData.organisation}
          onChange={(event) => updateField('organisation', event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium text-gray-700 block mb-1.5">Subject *</label>
        <select
          id="contact-subject"
          className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          value={formData.subject}
          onChange={(event) => updateField('subject', event.target.value)}
          required
        >
          <option value="">Select a topic...</option>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-gray-700 block mb-1.5">Message *</label>
        <textarea
          id="contact-message"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          rows={5}
          placeholder="How can we help you? Please provide as much detail as possible."
          value={formData.message}
          onChange={(event) => updateField('message', event.target.value)}
          required
        />
      </div>
      <Button variant="primary" size="lg" className="w-full" type="submit">
        Send Message
        <Mail className="h-4 w-4" />
      </Button>
      <p className="text-xs text-gray-400">
        By submitting this form you agree to our{' '}
        <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>.
        We never share your information with third parties.
      </p>
    </form>
  )
}

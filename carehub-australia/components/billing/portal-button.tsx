'use client'

import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

type BillingPortalButtonProps = {
  label?: string
}

export function BillingPortalButton({ label = 'Manage Subscription' }: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not open billing portal.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button variant="primary" onClick={handleClick} disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening portal...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {label}
          </span>
        )}
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}

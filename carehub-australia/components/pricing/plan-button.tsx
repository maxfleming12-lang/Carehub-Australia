'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type PlanButtonProps = {
  planName: string
  price: number
  buttonVariant: 'outline' | 'default' | 'primary' | 'secondary'
}

export function PlanButton({ planName, price, buttonVariant }: PlanButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    if (price === 0) {
      router.push('/auth/register')
      return
    }

    setLoading(true)

    try {
      const { supabase } = await createSupabaseBrowserClient()

      if (!supabase) {
        router.push('/auth/login?next=/pricing')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/auth/login?next=/pricing`)
        return
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: planName.toLowerCase() }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned', data)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={buttonVariant}
      className="w-full mb-6"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting...
        </span>
      ) : price === 0 ? 'Get Started Free' : 'Start Free Trial'}
    </Button>
  )
}

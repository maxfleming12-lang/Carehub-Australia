'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState } from 'react'

type Props = {
  defaultSearch: string
  defaultTier: string
  defaultStatus: string
}

export default function UserSearchBar({ defaultSearch, defaultTier, defaultStatus }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(defaultSearch)
  const [tier, setTier] = useState(defaultTier)
  const [status, setStatus] = useState(defaultStatus)

  const apply = (overrides: Partial<{ search: string; tier: string; status: string }> = {}) => {
    const params = new URLSearchParams()
    const s = overrides.search ?? search
    const t = overrides.tier ?? tier
    const st = overrides.status ?? status
    if (s) params.set('search', s)
    if (t) params.set('tier', t)
    if (st) params.set('status', st)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          placeholder="Search by name, email or organisation…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <select
        value={tier}
        onChange={(e) => { setTier(e.target.value); apply({ tier: e.target.value }) }}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <option value="">All plans</option>
        <option value="free">Free</option>
        <option value="starter">Starter</option>
        <option value="professional">Professional</option>
        <option value="enterprise">Enterprise</option>
      </select>

      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); apply({ status: e.target.value }) }}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="trialing">Trialing</option>
        <option value="inactive">Inactive</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button
        onClick={() => apply()}
        className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
      >
        Search
      </button>

      {(search || tier || status) && (
        <button
          onClick={() => {
            setSearch(''); setTier(''); setStatus('')
            router.push(pathname)
          }}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}

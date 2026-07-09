'use client'

import { createBrowserClient } from '@supabase/ssr'
import {
  getSupabasePublicConfig,
  isPlaceholderSupabaseValue,
} from '@/lib/supabase-config'
import type { Database } from '@/types/database'

type BrowserClientResult =
  | {
      supabase: ReturnType<typeof createBrowserClient<Database>>
      error: null
    }
  | {
      supabase: null
      error: string
    }

function isHeaderSafe(value: string) {
  return /^[\x21-\x7E]+$/.test(value)
}

function isHeaderValueByteSafe(value: string) {
  for (const char of value) {
    if ((char.codePointAt(0) ?? 0) > 255) {
      return false
    }
  }

  return true
}

function isAuthorizationHeaderSafe(value: string) {
  const token = value.replace(/^Bearer\s+/i, '')
  return isHeaderValueByteSafe(value) && isHeaderSafe(token)
}

function isHeaderEncodingError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return message.includes('headers') && message.includes('ISO-8859-1')
}

function getBrowserLocalStorage() {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage
  } catch {
    return null
  }
}

function isSupabaseAuthStorageKey(key: string) {
  return (
    (key.startsWith('sb-') && key.endsWith('-auth-token')) ||
    key === 'supabase.auth.token'
  )
}

function getSupabaseAuthStorageKeys(storage: Storage) {
  const keys: string[] = []

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)

    if (key && isSupabaseAuthStorageKey(key)) {
      keys.push(key)
    }
  }

  return keys
}

function collectStoredTokenValues(value: unknown, tokens: string[] = []) {
  if (!value || typeof value !== 'object') {
    return tokens
  }

  Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
    if (typeof child === 'string') {
      if (/token/i.test(key)) {
        tokens.push(child)
      }

      return
    }

    collectStoredTokenValues(child, tokens)
  })

  return tokens
}

function hasUnsafeStoredAuthToken(value: string | null) {
  if (!value) {
    return false
  }

  try {
    const tokens = collectStoredTokenValues(JSON.parse(value))
    return tokens.some((token) => !isHeaderSafe(token))
  } catch {
    return !isHeaderSafe(value)
  }
}

export function clearInvalidSupabaseAuthStorage() {
  const storage = getBrowserLocalStorage()

  if (!storage) {
    return false
  }

  let cleared = false

  getSupabaseAuthStorageKeys(storage).forEach((key) => {
    if (hasUnsafeStoredAuthToken(storage.getItem(key))) {
      storage.removeItem(key)
      cleared = true
    }
  })

  return cleared
}

export function clearSupabaseAuthStorage() {
  const storage = getBrowserLocalStorage()

  if (!storage) {
    return false
  }

  let cleared = false

  getSupabaseAuthStorageKeys(storage).forEach((key) => {
    storage.removeItem(key)
    cleared = true
  })

  return cleared
}

function getHeaderEntries(headersInit: HeadersInit) {
  if (typeof Headers !== 'undefined' && headersInit instanceof Headers) {
    const entries: Array<[string, string]> = []
    headersInit.forEach((value, key) => entries.push([key, value]))
    return entries
  }

  if (Array.isArray(headersInit)) {
    return headersInit.map(
      ([key, value]) => [key, String(value)] as [string, string]
    )
  }

  return Object.entries(headersInit).map(
    ([key, value]) => [key, String(value)] as [string, string]
  )
}

function sanitizeHeaders(
  headersInit: HeadersInit | undefined,
  supabaseKey: string,
  forceAnonAuthorization = false
) {
  if (!headersInit) {
    return headersInit
  }

  const safeHeaders = new Headers()

  getHeaderEntries(headersInit).forEach(([key, value]) => {
    if (
      key.toLowerCase() === 'authorization' &&
      (forceAnonAuthorization || !isAuthorizationHeaderSafe(value))
    ) {
      safeHeaders.set(key, `Bearer ${supabaseKey}`)
      return
    }

    if (!isHeaderValueByteSafe(value)) {
      throw new Error(
        `Supabase request header "${key}" contains invalid characters. Please sign in again.`
      )
    }

    safeHeaders.append(key, value)
  })

  return safeHeaders
}

function sanitizeRequestInit(
  init: RequestInit | undefined,
  supabaseKey: string,
  forceAnonAuthorization = false
) {
  if (!init) {
    return init
  }

  return {
    ...init,
    headers: sanitizeHeaders(init.headers, supabaseKey, forceAnonAuthorization),
  }
}

function createHeaderSafeFetch(supabaseKey: string): typeof fetch {
  return async (input, init) => {
    try {
      return await fetch(input, sanitizeRequestInit(init, supabaseKey))
    } catch (error) {
      if (!isHeaderEncodingError(error)) {
        throw error
      }

      clearSupabaseAuthStorage()

      return fetch(
        input,
        sanitizeRequestInit(init, supabaseKey, true)
      )
    }
  }
}

function buildBrowserClient(
  supabaseUrl: string | undefined,
  supabaseKey: string | undefined,
  unconfiguredMessage = 'Login is not configured yet. Please contact support.'
): BrowserClientResult {
  if (
    !supabaseUrl ||
    !supabaseKey ||
    isPlaceholderSupabaseValue(supabaseUrl) ||
    isPlaceholderSupabaseValue(supabaseKey)
  ) {
    return {
      supabase: null,
      error: unconfiguredMessage,
    }
  }

  try {
    new URL(supabaseUrl)
  } catch {
    return {
      supabase: null,
      error: 'Supabase URL is invalid. Please check the site configuration.',
    }
  }

  if (!isHeaderSafe(supabaseKey)) {
    return {
      supabase: null,
      error:
        'Supabase publishable key contains invalid characters. Re-copy it from Supabase without smart quotes or hidden characters.',
    }
  }

  return {
    supabase: createBrowserClient<Database>(supabaseUrl, supabaseKey, {
      global: {
        fetch: createHeaderSafeFetch(supabaseKey),
      },
    }),
    error: null,
  }
}

export async function createSupabaseBrowserClient(
  unconfiguredMessage = 'Login is not configured yet. Please contact support.'
): Promise<BrowserClientResult> {
  clearInvalidSupabaseAuthStorage()

  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()
  const bundledClient = buildBrowserClient(
    supabaseUrl,
    supabaseKey,
    unconfiguredMessage
  )

  if (bundledClient.supabase) {
    return bundledClient
  }

  try {
    const response = await fetch('/api/auth/config', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return bundledClient
    }

    const config = (await response.json()) as {
      supabaseUrl?: string
      supabaseKey?: string
    }

    return buildBrowserClient(
      config.supabaseUrl,
      config.supabaseKey,
      unconfiguredMessage
    )
  } catch {
    return bundledClient
  }
}

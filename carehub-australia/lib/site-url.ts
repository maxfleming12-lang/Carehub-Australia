// Canonical site origin for metadata, sitemaps, and structured data.
// Coerces accidental http:// values (seen in env config) to https://
// for any non-localhost host.
const raw = process.env.NEXT_PUBLIC_APP_URL || 'https://sataus.net'

export const SITE_URL = raw.includes('localhost')
  ? raw
  : raw.replace(/^http:\/\//, 'https://').replace(/\/$/, '')

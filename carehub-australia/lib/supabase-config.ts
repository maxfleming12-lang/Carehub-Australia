const quoteChars = /^[`"'“”‘’]+|[`"'“”‘’]+$/g
const invisibleChars = /[\u200B-\u200D\uFEFF]/g
const nonHeaderChars = /[^\x21-\x7E]/g

export function cleanSupabaseEnvValue(value: string | undefined) {
  return value
    ?.trim()
    .replace(invisibleChars, '')
    .replace(quoteChars, '')
    .replace(/\s+/g, '')
    .replace(nonHeaderChars, '')
}

export function getSupabasePublicConfig() {
  return {
    supabaseUrl: cleanSupabaseEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseKey: cleanSupabaseEnvValue(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  }
}

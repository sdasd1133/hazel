import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    })
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

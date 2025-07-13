import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 기본값 설정
const DEFAULT_SUPABASE_URL = 'https://placeholder.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'placeholder-key'

export async function createClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

  // 환경변수가 설정되지 않은 경우
  if (supabaseUrl === DEFAULT_SUPABASE_URL || supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase server configuration not properly set.')
    
    // 모킹된 서버 클라이언트 반환
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      })
    } as any
  }

  try {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    
    // 오류 발생 시 모킹된 클라이언트 반환
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase server connection failed' } }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      })
    } as any
  }
}

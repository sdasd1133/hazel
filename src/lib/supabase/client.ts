import { createBrowserClient } from '@supabase/ssr'

// 기본값 설정 (배포 환경에서 환경변수가 없을 때 사용)
const DEFAULT_SUPABASE_URL = 'https://placeholder.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'placeholder-key'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

  // 프로덕션에서 환경변수가 설정되지 않은 경우 경고
  if (typeof window !== 'undefined' && (supabaseUrl === DEFAULT_SUPABASE_URL || supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY)) {
    console.warn('⚠️ Supabase configuration not properly set. Some features may not work.')
    
    // 모킹된 클라이언트 반환
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
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
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    // 오류 발생 시에도 모킹된 클라이언트 반환
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase connection failed' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
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

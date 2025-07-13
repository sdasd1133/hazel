// 환경변수 체크 및 안전한 기본값 제공
export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key')
}

export const getSupabaseConfig = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    isConfigured: isSupabaseConfigured()
  }
}

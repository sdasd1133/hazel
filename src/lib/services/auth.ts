import { createClient } from '@/lib/supabase/client'

export interface SignUpData {
  email: string
  password: string
  name: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

// 클라이언트 사이드 인증만 사용
export const authClient = {
  // 회원가입
  async signUp(data: SignUpData) {
    const supabase = createClient()
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone || ''
        }
      }
    })

    if (error) throw error
    return authData
  },

  // 로그인
  async signIn(data: SignInData) {
    const supabase = createClient()
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) throw error
    return authData
  },

  // 로그아웃
  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // 현재 사용자 정보
  async getCurrentUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // 관리자 여부 확인
  isAdmin(user: any) {
    const adminEmails = ['admin@hazel.com', 'admin2@hazel.com'];
    return adminEmails.includes(user?.email);
  },

  // 사용자 프로필 조회
  async getUserProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // 사용자 프로필 업데이트
  async updateUserProfile(userId: string, updates: Partial<{name: string, phone: string, address: string}>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

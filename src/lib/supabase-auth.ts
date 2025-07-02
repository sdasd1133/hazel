import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/supabase';
import { supabase } from './supabase';
import { getSupabaseUser, createSupabaseUser } from './supabase-utils';

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLastVisitedPage: (path: string | null) => void;
}>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      lastVisitedPage: null,

      login: async (email, password) => {
        try {
          // Supabase 인증 시스템을 통한 로그인
          // (현재는 Supabase Auth를 완전히 구현하지 않고 기존 로직을 활용)
          // 실제 환경에서는 Supabase의 auth.signInWithPassword를 사용해야 함
          
          // 임시: 이메일로 사용자 찾기
          let user = await getSupabaseUser(email);
          
          // 사용자가 없으면 새로 생성 (실제 환경에서는 회원가입 과정이 별도로 필요)
          if (!user) {
            const name = email.split('@')[0]; // 이메일에서 이름 추출
            user = await createSupabaseUser(email, name);
          }
          
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        // Supabase 로그아웃 (실제 환경에서는 supabase.auth.signOut() 호출)
        set({ user: null, isAuthenticated: false, lastVisitedPage: null });
      },

      setLastVisitedPage: (path) => set({ lastVisitedPage: path }),
    }),
    {
      name: 'auth-store',
    }
  )
);

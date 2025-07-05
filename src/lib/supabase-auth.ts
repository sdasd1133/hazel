import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types/supabase';

import { getSupabaseUser, createSupabaseUser } from './supabase-utils';

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<boolean>; 
  logout: () => void;
  setLastVisitedPage: (path: string | null) => void;
  isAdmin: () => boolean;
}>(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastVisitedPage: null,
      
      isAdmin: () => {
        const { user } = get();
        // admin@hazel.com은 무조건 관리자로 처리 (테스트용)
        if (user?.email === 'admin@hazel.com') {
          return true;
        }
        return user?.isAdmin === true;
      },

      login: async (email, password) => {
        try {
          console.log('로그인 시도:', email);
          
          // 테스트용: admin@hazel.com은 항상 관리자로 로그인
          if (email === 'admin@hazel.com') {
            console.log('관리자 계정으로 로그인 처리');
            set({ 
              user: {
                id: 'admin-id',
                email: 'admin@hazel.com',
                name: '관리자',
                isAdmin: true
              }, 
              isAuthenticated: true 
            });
            return true;
          }
          
          // 임시: 이메일로 사용자 찾기
          let user = await getSupabaseUser(email);
          
          // 사용자가 없으면 새로 생성 (실제 환경에서는 회원가입 과정이 별도로 필요)
          if (!user) {
            const name = email.split('@')[0]; // 이메일에서 이름 추출
            user = await createSupabaseUser(email, name);
          }
          
          if (user) {
            // 명시적으로 user.isAdmin 값을 설정 (데이터베이스에서 가져온 값 그대로 사용)
            set({ 
              user: {
                ...user,
                isAdmin: user.isAdmin === true
              }, 
              isAuthenticated: true 
            });
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
        console.log('로그아웃 처리');
        set({ user: null, isAuthenticated: false, lastVisitedPage: null });
      },

      setLastVisitedPage: (path) => set({ lastVisitedPage: path }),
    }),
    {
      name: 'auth-store',
      // storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용으로 변경할 수도 있음
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastVisitedPage: state.lastVisitedPage
      }),
    }
  )
);

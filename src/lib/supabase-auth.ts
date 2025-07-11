import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types/supabase';

type AuthStoreState = AuthState & {
  login: (email: string, password: string) => Promise<boolean>; 
  logout: () => void;
  setLastVisitedPage: (path: string | null) => void;
  isAdmin: () => boolean;
};

export const useAuthStore = create<AuthStoreState>()(
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

      login: async (email: string, password: string) => {
        try {
          console.log('로그인 시도:', email);
          console.log('비밀번호 검증 스킵 (테스트 모드):', password ? '입력됨' : '미입력');
          
          // 테스트용 계정들 (현재는 비밀번호 검증하지 않음 - 실제 운영에서는 보안 강화 필요)
          const testAccounts = {
            'admin@hazel.com': {
              id: 'admin-id',
              email: 'admin@hazel.com',
              name: '관리자',
              isAdmin: true
            },
            'user@example.com': {
              id: 'user-id-1',
              email: 'user@example.com',
              name: '테스트 사용자',
              isAdmin: false
            },
            'test@hazel.com': {
              id: 'user-id-2',
              email: 'test@hazel.com',
              name: '일반 사용자',
              isAdmin: false
            }
          };
          
          // 테스트 계정인지 확인 (현재는 비밀번호 무시)
          if (testAccounts[email as keyof typeof testAccounts]) {
            console.log('테스트 계정으로 로그인 처리:', email);
            const user = testAccounts[email as keyof typeof testAccounts];
            set({ 
              user,
              isAuthenticated: true 
            });
            return true;
          }
          
          // 테스트가 아닌 계정의 경우
          console.log('등록되지 않은 계정입니다:', email);
          return false;
          
          // 실제 Supabase 계정 처리 (현재는 비활성화)
          /*
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
          */
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
      skipHydration: false,
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // 이전 버전과의 호환성을 위한 마이그레이션 로직
          return persistedState;
        }
        return persistedState;
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastVisitedPage: state.lastVisitedPage
      }),
    }
  )
);

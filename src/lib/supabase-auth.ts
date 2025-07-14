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
              isAdmin: true,
              status: 'approved' as const
            },
            'user@example.com': {
              id: 'user-id-1',
              email: 'user@example.com',
              name: '테스트 사용자',
              isAdmin: false,
              status: 'approved' as const
            },
            'test@hazel.com': {
              id: 'user-id-2',
              email: 'test@hazel.com',
              name: '일반 사용자',
              isAdmin: false,
              status: 'approved' as const
            },
            'pending@hazel.com': {
              id: 'user-id-3',
              email: 'pending@hazel.com',
              name: '승인 대기 사용자',
              isAdmin: false,
              status: 'pending' as const
            },
            'rejected@hazel.com': {
              id: 'user-id-4',
              email: 'rejected@hazel.com',
              name: '승인 거부 사용자',
              isAdmin: false,
              status: 'rejected' as const
            }
          };
          
          // 테스트 계정인지 확인 (현재는 비밀번호 무시)
          if (testAccounts[email as keyof typeof testAccounts]) {
            console.log('테스트 계정으로 로그인 처리:', email);
            const user = testAccounts[email as keyof typeof testAccounts];
            
            // 승인 상태 확인
            if (user.status === 'pending') {
              alert('계정이 아직 승인되지 않았습니다. 관리자의 승인을 기다려주세요.');
              return false;
            }
            
            if (user.status === 'rejected') {
              alert('계정이 승인 거부되었습니다. 관리자에게 문의하세요.');
              return false;
            }
            
            // 승인된 계정만 로그인 허용
            if (user.status === 'approved') {
              set({ 
                user,
                isAuthenticated: true 
              });
              return true;
            }
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
            // 승인 상태 확인
            if (user.status === 'pending') {
              alert('계정이 아직 승인되지 않았습니다. 관리자의 승인을 기다려주세요.');
              return false;
            }
            
            if (user.status === 'rejected') {
              alert('계정이 승인 거부되었습니다. 관리자에게 문의하세요.');
              return false;
            }
            
            // 승인된 계정만 로그인 허용
            if (user.status === 'approved') {
              set({ 
                user: {
                  ...user,
                  isAdmin: user.isAdmin === true
                }, 
                isAuthenticated: true 
              });
              return true;
            }
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

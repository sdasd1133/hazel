import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  lastVisitedPage: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLastVisitedPage: (page: string) => void;
}

// 더미 사용자 데이터
const DUMMY_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: '테스트 사용자',
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    name: '관리자',
    isAdmin: true,
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      lastVisitedPage: null,
      login: async (email: string, password: string) => {
        // 실제 앱에서는 API 호출을 통해 서버에서 인증해야 합니다.
        // 이 예제에서는 간단한 로컬 인증을 사용합니다.
        const user = DUMMY_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: ignored, ...userData } = user;
          set({ user: userData as User, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      setLastVisitedPage: (page: string) => {
        set({ lastVisitedPage: page });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastVisitedPage: state.lastVisitedPage,
      }),
    }
  )
);

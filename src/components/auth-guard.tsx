"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/supabase-auth';
import { useHydrated } from '@/hooks/useHydrated';
import { logger } from '@/lib/logger';

interface AuthGuardProps {
  children: React.ReactNode;
}

// 로그인 없이 접근 가능한 페이지들
const PUBLIC_PATHS = [
  '/',           // 메인 페이지
  '/login',
  '/register',
  // 필요시 다른 공개 페이지 추가 가능
];

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = () => {
      try {
        // 공개 페이지인 경우 인증 체크 스킵
        if (PUBLIC_PATHS.includes(pathname)) {
          setIsLoading(false);
          return;
        }

        if (isAuthenticated && user) {
          logger.log('AuthGuard: 사용자 인증됨', user.email);
          setIsLoading(false);
        } else {
          logger.log('AuthGuard: 사용자 인증되지 않음, 로그인 페이지로 리다이렉트');
          router.push('/login');
        }
      } catch (error) {
        logger.error('AuthGuard: 인증 확인 오류', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [hydrated, isAuthenticated, user, pathname, router]);

  // 로딩 중일 때 표시할 컴포넌트
  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 (공개 페이지가 아닌 경우에만)
  if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">이 페이지에 접근하려면 로그인해야 합니다.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;

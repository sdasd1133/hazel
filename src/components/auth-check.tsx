"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/supabase-auth';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setLastVisitedPage = useAuthStore((state) => state.setLastVisitedPage);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      // 현재 경로 저장
      setLastVisitedPage(pathname);
      // 로그인 페이지로 리다이렉트
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname, setLastVisitedPage]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>인증 확인 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}

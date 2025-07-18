'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/supabase-auth';
import { useHydrated } from '@/hooks/useHydrated';
import { logger } from '@/lib/logger';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const hydrated = useHydrated();

  useEffect(() => {
    // hydration이 완료되지 않았으면 대기
    if (!hydrated) {
      return;
    }

    const checkAuth = () => {
      logger.log('관리자 레이아웃 인증 확인:', { isAuthenticated, user, isAdmin: isAdmin() });

      if (!isAuthenticated || !user) {
        logger.log('인증되지 않음 - 로그인 페이지로 이동');
        router.push('/login');
        return;
      }

      // 관리자 권한 확인
      if (!isAdmin()) {
        logger.log('관리자 권한 없음 - 메인 페이지로 이동');
        alert('관리자 권한이 없습니다.');
        router.push('/');
        return;
      }

      logger.log('관리자 권한 승인됨');
      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [hydrated, isAuthenticated, user, router, isAdmin]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // 로딩 중이거나 권한이 없는 경우
  if (!hydrated || loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? '인증 확인 중...' : '권한 확인 중...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>
        </div>
        
        <nav className="mt-8">
          <div className="space-y-1 px-3">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard className="h-5 w-5" />
              대시보드
            </Link>
            
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <Package className="h-5 w-5" />
              상품 관리
            </Link>
            
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <Users className="h-5 w-5" />
              사용자 관리
            </Link>
            
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <ShoppingCart className="h-5 w-5" />
              주문 관리
            </Link>
            
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings className="h-5 w-5" />
              설정
            </Link>
          </div>
        </nav>
        
        {/* 하단 로그아웃 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <div className="mb-3 px-3 py-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">로그인된 사용자:</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 hover:text-red-900"
          >
            <LogOut className="h-5 w-5" />
            로그아웃
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pl-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">관리자 패널</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user?.name || user?.email}님 환영합니다
                </span>
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  사이트로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { authClient } from '@/lib/services/auth';
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
  const [user, setUser] = useState<any>(null);
  const hydrated = useHydrated();

  // 관리자 이메일 체크 함수
  const isAdmin = (userEmail: string) => {
    const adminEmails = ['admin@hazel.com', 'admin2@hazel.com'];
    return adminEmails.includes(userEmail);
  };

  useEffect(() => {
    // hydration이 완료되지 않았으면 대기
    if (!hydrated) {
      return;
    }

    let mounted = true;

    console.log('관리자 레이아웃 상태 확인 중...');
    
    // 인증 상태와 관리자 권한 확인
    const checkAuth = async () => {
      try {
        const currentUser = await authClient.getCurrentUser();
        console.log('현재 사용자:', currentUser?.email);
        
        if (!mounted) return;
        
        if (!currentUser) {
          console.log('인증되지 않음 - 로그인 페이지로 이동');
          router.push('/admin/login');
          return;
        }

        setUser(currentUser);
        
        // 관리자 권한 확인
        const adminAccess = isAdmin(currentUser.email);
        console.log('관리자 권한:', adminAccess, '이메일:', currentUser.email);
        
        if (!mounted) return;
        
        if (adminAccess) {
          setAuthorized(true);
          console.log('관리자 권한 승인됨');
          
          // Header 컴포넌트가 인증 상태를 반영하도록 강제 새로고침
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-login-success'));
          }
        } else {
          console.log('관리자 권한 없음 - 메인 페이지로 이동');
          alert('관리자 권한이 없습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('관리자 권한 확인 오류:', error);
        if (mounted) {
          router.push('/admin/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [hydrated, router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      router.push('/admin/login');
    }
  };

  // hydration 이전에는 로딩 화면 표시
  if (!hydrated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg font-medium">시스템 초기화 중...</div>
      </div>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg font-medium">관리자 인증 중...</div>
        <div className="text-sm text-gray-500 mt-2">
          사용자: {user?.email || '확인 중...'}
        </div>
      </div>
    );
  }

  // 권한이 없는 경우 빈 컴포넌트 반환 (리다이렉트 처리됨)
  if (!authorized) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800">GL ADMIN</h1>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span>대시보드</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                <Package className="h-5 w-5 mr-3" />
                <span>상품 관리</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-5 w-5 mr-3" />
                <span>주문 관리</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                <Users className="h-5 w-5 mr-3" />
                <span>사용자 관리</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                <Settings className="h-5 w-5 mr-3" />
                <span>설정</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>로그아웃</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}

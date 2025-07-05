'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/supabase-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, logout, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    console.log('관리자 레이아웃 상태:', { isAuthenticated, isAdmin: isAdmin(), user });
    
    // 인증 상태와 관리자 권한 확인
    const checkAuth = async () => {
      setLoading(true);

      // 3초 후에도 여전히 로딩 중이라면 로그인 페이지로 이동
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('인증 시간 초과, 로그인 페이지로 이동');
          router.push('/admin/login');
        }
      }, 3000);
      
      // 인증 상태 확인
      if (!isAuthenticated) {
        console.log('사용자 인증되지 않음, 로그인 페이지로 이동');
        router.push('/admin/login');
        clearTimeout(timeoutId);
        return;
      }
      
      // 관리자 권한 확인 (admin@hazel.com 이메일이면 무조건 관리자로 취급)
      if (user?.email === 'admin@hazel.com') {
        console.log('admin@hazel.com 계정으로 인증됨, 권한 승인');
        setAuthorized(true);
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      
      const adminCheck = isAdmin();
      if (!adminCheck) {
        console.log('관리자 권한 없음, 로그인 페이지로 이동');
        router.push('/admin/login');
        clearTimeout(timeoutId);
        return;
      }
      
      // 인증 및 권한 확인 완료
      console.log('인증 및 권한 확인 완료');
      setAuthorized(true);
      setLoading(false);
      clearTimeout(timeoutId);
    };
    
    checkAuth();
  }, [isAuthenticated, isAdmin, router, user, loading]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // 로딩 상태 디버깅용 컴포넌트
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="animate-pulse text-lg font-medium mb-4">로딩 중...</div>
        <div className="text-sm text-gray-500">
          인증 상태: {isAuthenticated ? '인증됨' : '인증되지 않음'}<br />
          이메일: {user?.email || '없음'}<br />
          관리자 권한: {isAdmin() ? '있음' : '없음'}
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
              <Link href="/admin" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span>대시보드</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors">
                <Package className="h-5 w-5 mr-3" />
                <span>상품 관리</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5 mr-3" />
                <span>주문 관리</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors">
                <Users className="h-5 w-5 mr-3" />
                <span>사용자 관리</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors">
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

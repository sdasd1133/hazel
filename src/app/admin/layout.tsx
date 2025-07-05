'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/supabase-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 인증되지 않았거나 관리자가 아니면 로그인 페이지로 이동
    if (!isAuthenticated || !isAdmin()) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // 인증 중이거나 권한 체크 중일 때 보여줄 로딩 화면
  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg font-medium">로딩 중...</div>
      </div>
    );
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

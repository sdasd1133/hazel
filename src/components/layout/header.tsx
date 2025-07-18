"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Menu, LogOut, ChevronDown, UserPlus } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/supabase-auth";
import { getParentCategories, getCategoriesByParent } from "@/lib/products";
import { getUrlFromCategory } from "@/lib/category-utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { logger } from "@/lib/logger";

const Header = () => {
  const parentCategories = getParentCategories();
  const cartCount = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hydrated = useHydrated();
  const headerRef = useRef<HTMLDivElement>(null);
  
  // 클릭 이벤트 핸들러
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      logout();
      logger.log('로그아웃 성공');
      router.push('/');
      router.refresh();
    } catch (error) {
      logger.error('로그아웃 오류:', error);
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      {/* 상단 로고와 네비게이션 */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* 모바일 메뉴 아이콘 */}
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴</span>
            </Button>
          </div>
          
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <div className="h-14 flex items-center justify-center">
                <Image 
                  src="/gl-logo.svg" 
                  alt="GL GOOD LUCK FASHION" 
                  width={200}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex space-x-2">
            {parentCategories.map((category) => (
              <div 
                key={category.id} 
                className="relative group"
              >
                <Link
                  href={`/products?parent=${category.id}`}
                  onClick={() => {
                    console.log('상위 카테고리 클릭:', category.name, 'ID:', category.id);
                    console.log('이동할 URL:', `/products?parent=${category.id}`);
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <span>{category.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                
                {/* 서브메뉴 (호버 시 표시) */}
                <div className="absolute left-0 top-full w-48 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl border border-border p-3">
                    {/* 상위 카테고리별 하위 카테고리 표시 */}
                    {getCategoriesByParent(category.id).map(subCategory => (
                      <Link
                        key={subCategory.id}
                        href={getUrlFromCategory(subCategory.name)}
                        prefetch={false}
                        className="block px-3 py-2 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        {subCategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* 관리자 메뉴 */}
            {hydrated && isAuthenticated && isAdmin() && (
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 rounded-md text-red-600 hover:text-red-500 hover:bg-red-50 transition-all duration-300 font-medium"
              >
                <span>관리자</span>
              </Link>
            )}
          </nav>

          {/* 검색, 장바구니, 로그인 아이콘 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 검색 */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            >
              <Search className="h-[18px] w-[18px]" />
              <span className="sr-only">검색</span>
            </Button>
            
            {/* 장바구니 */}
            <Link href={isAuthenticated ? "/cart" : "/login?redirectTo=%2Fcart"} className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                <span className="sr-only">장바구니</span>
              </Button>
              {hydrated && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* 회원정보 */}
            {hydrated ? (
              isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline text-sm font-medium text-black">
                    {user?.name || user?.email?.split('@')[0]}님
                  </span>
                  <Link href="/mypage">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10" 
                    >
                      <User className="h-[18px] w-[18px]" />
                      <span className="sr-only">마이페이지</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-red-50 hover:text-red-500" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    <span className="sr-only">로그아웃</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 py-1.5 px-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">로그인</span>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      rounded 
                      className="flex items-center gap-2 py-1.5 px-3 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">회원가입</span>
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              // hydration 전에는 기본 상태 표시 (로그인 전 상태)
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">로그인</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    rounded 
                    className="flex items-center gap-2 py-1.5 px-3 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">회원가입</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      <div 
        className={`lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md absolute top-full left-0 w-full border-t border-border shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="space-y-2">
            {parentCategories.map((category) => (
              <div key={category.id} className="space-y-1">
                <Link
                  href={`/products?parent=${category.id}`}
                  className="block py-2.5 px-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-md font-medium transition-colors"
                  onClick={() => {
                    console.log('모바일 상위 카테고리 클릭:', category.name, 'ID:', category.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {category.name}
                </Link>
                
                {/* 서브 카테고리 */}
                <div className="pl-5 space-y-1">
                  {getCategoriesByParent(category.id).map(subCategory => (
                    <Link
                      key={subCategory.id}
                      href={getUrlFromCategory(subCategory.name)}
                      prefetch={false}
                      className="block py-2 px-3 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {subCategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="border-t border-border my-3"></div>
            <Link
              href="/products"
              className="block py-2.5 px-3 text-foreground/80 font-medium hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              전체 상품
            </Link>
            
            {/* 관리자 메뉴 (모바일) */}
            {hydrated && isAuthenticated && isAdmin() && (
              <>
                <div className="border-t border-border my-3"></div>
                <Link
                  href="/admin"
                  className="block py-2.5 px-3 text-red-600 font-medium hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  관리자 대시보드
                </Link>
              </>
            )}
            
            {/* 모바일 사용자 메뉴 */}
            {hydrated && isAuthenticated && (
              <>
                <div className="border-t border-border my-3"></div>
                <div className="space-y-2">
                  <Link
                    href="/mypage"
                    className="flex items-center gap-3 py-2.5 px-3 text-foreground/80 font-medium hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-2.5 px-3 w-full text-left text-red-600 font-medium hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              </>
            )}
            
            {/* 모바일 로그인/회원가입 버튼 */}
            {hydrated && !isAuthenticated && (
              <>
                <div className="border-t border-border my-3"></div>
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-3 py-2.5 px-3 text-foreground/80 font-medium hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 py-2.5 px-3 text-white font-medium bg-gradient-to-r from-primary to-secondary rounded-md hover:shadow-lg transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    회원가입
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

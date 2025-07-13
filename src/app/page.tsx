"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/services/auth";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('인증 상태 확인 중...');
        const currentUser = await authClient.getCurrentUser();
        console.log('현재 사용자:', currentUser);
        
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('인증됨:', currentUser.email);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('인증되지 않음');
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Supabase 인증 상태 변화 감지
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('인증 상태 변화:', event, session);
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          console.log('세션으로 인증됨:', session.user.email);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('세션 없음 - 인증되지 않음');
        }
        setLoading(false);
      }
    );

    // 초기 인증 상태 확인
    checkAuth();
    
    // 페이지가 포커스될 때마다 인증 상태 재확인
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-dark/80 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 z-10 opacity-30 bg-[url('/hero-pattern.svg')]"></div>
        
        {/* 컨텐츠 */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-30 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            오셨습니까 형님!누님!
          </h1>
          
          {/* 디버깅 정보 (개발 시에만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-black/50 rounded text-white text-sm">
              <p>인증 상태: {isAuthenticated ? '로그인됨' : '로그인 안됨'}</p>
              {user && <p>사용자: {user.email}</p>}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/products">
                  <Button variant="gradient" size="lg" rounded className="group min-w-[180px]">
                    쇼핑하기 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-white mt-2">
                  환영합니다, {user?.email || '사용자'}님!
                </p>
              </>
            ) : (
              <Button variant="gradient" size="lg" rounded className="group min-w-[220px]" onClick={() => router.push('/login')}>
                로그인하고 쇼핑하기 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

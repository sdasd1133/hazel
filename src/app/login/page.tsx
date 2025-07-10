"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Lock, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/supabase-auth';

// 로그인 페이지 - searchParams를 사용하는 컴포넌트를 Suspense로 감싸야 합니다
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8 rounded-xl shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

// SearchParams를 사용하는 부분을 별도의 컴포넌트로 분리
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const lastVisitedPage = useAuthStore((state) => state.lastVisitedPage);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || lastVisitedPage || '/products';
  
  // 이미 로그인된 사용자는 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        setLoginSuccess(true);
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 800);
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      if (!loginSuccess) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-foreground/70 hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white">
              {loginSuccess ? <Check className="h-8 w-8" /> : <User className="h-8 w-8" />}
            </div>
            <h1 className="text-2xl font-bold">{loginSuccess ? '로그인 성공!' : '로그인'}</h1>
            {!loginSuccess && (
              <p className="text-muted-foreground mt-2">
                계정에 로그인하여 HAZEL의 모든 기능을 이용해보세요
              </p>
            )}
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-start">
              <div className="w-5 h-5 mr-2 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                !
              </div>
              <p>{error}</p>
            </div>
          )}
          
          {loginSuccess ? (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Loader2 className="animate-spin h-5 w-5" />
                <p>리다이렉트 중...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 flex items-center">
                  <User className="h-4 w-4 mr-1" /> 이메일
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                    placeholder="user@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="text-sm font-medium mb-2 flex items-center">
                  <Lock className="h-4 w-4 mr-1" /> 비밀번호
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full py-3"
                  rounded
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      로그인 중...
                    </>
                  ) : '로그인'}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">테스트 계정 안내</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>관리자:</strong> admin@hazel.com (비밀번호: 임의입력)</p>
                  <p><strong>일반사용자:</strong> user@example.com (비밀번호: 임의입력)</p>
                  <p><strong>일반사용자:</strong> test@hazel.com (비밀번호: 임의입력)</p>
                  <p className="text-blue-600 mt-2">※ 현재는 테스트 모드로 비밀번호 검증을 하지 않습니다.</p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

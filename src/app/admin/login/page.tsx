'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/supabase-auth';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@hazel.com');  // 기본값으로 테스트 계정 설정
  const [password, setPassword] = useState('password');   // 기본값으로 임의 비밀번호 설정
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAdmin, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    console.log('로그인 페이지 상태:', { isAuthenticated, isAdmin: isAdmin(), user });
    
    // 이미 인증되어 있고 관리자인 경우 관리자 대시보드로 리다이렉트
    if (isAuthenticated && isAdmin()) {
      console.log('이미 인증된 관리자, 대시보드로 이동');
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('로그인 시도:', email);
      const success = await login(email, password);
      
      if (success) {
        // 로그인 후 관리자 권한 확인
        const adminCheck = isAdmin();
        console.log('로그인 성공, 관리자 권한:', adminCheck);
        
        if (adminCheck) {
          console.log('관리자로 로그인 성공, 대시보드로 이동');
          router.push('/admin');
        } else {
          console.log('관리자 권한이 없음');
          setError('관리자 권한이 없습니다. 관리자 계정으로 로그인하세요.');
        }
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 테스트용 자동 로그인 기능
  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated && !isLoading && !error) {
        console.log('자동 로그인 시도');
        await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      }
    };
    
    autoLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">관리자 로그인</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            관리자 계정으로 로그인하세요.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="admin@hazel.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
          
          <div className="text-sm text-center text-gray-500">
            <p>테스트용 계정: admin@hazel.com / 비밀번호 아무거나</p>
          </div>
        </form>
      </div>
    </div>
  );
}

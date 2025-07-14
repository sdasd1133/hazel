'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/services/auth';
import { useAuthStore } from '@/lib/supabase-auth';
import { logger } from '@/lib/logger';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isAdmin, user, isAuthenticated } = useAuthStore();

  // 이미 로그인된 사용자 체크
  useEffect(() => {
    if (isAuthenticated && user) {
      logger.log('이미 로그인된 사용자, 메인 페이지로 리다이렉트');
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('로그인 시도:', email);
      
      // 우리의 승인 시스템을 사용 (supabase-auth.ts)
      const success = await login(email, password);
      
      if (!success) {
        setError('이메일 또는 비밀번호가 올바르지 않거나 승인되지 않은 계정입니다.');
        setLoading(false);
        return;
      }

      // 로그인 성공 후 페이지 이동
      setTimeout(() => {
        if (isAdmin()) {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 500);
    } catch (err: any) {
      logger.error('로그인 오류:', err);
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const createTestAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authClient.signUp({
        email: 'test@hazel.com',
        password: 'password123',
        name: 'Test User'
      });
      setError('테스트 계정이 생성되었습니다. 로그인해주세요.');
    } catch (err: any) {
      setError(`테스트 계정 생성 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createAdminAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authClient.signUp({
        email: 'admin2@hazel.com',
        password: 'admin123',
        name: 'Admin User'
      });
      setError('관리자 계정(admin2@hazel.com)이 생성되었습니다. 로그인해주세요.');
    } catch (err: any) {
      setError(`관리자 계정 생성 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
              계정이 없으신가요? 회원가입
            </Link>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="space-y-3">
              <button
                type="button"
                onClick={createTestAccount}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                테스트 계정 생성 (test@hazel.com)
              </button>
              <button
                type="button"
                onClick={createAdminAccount}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                관리자 계정 생성 (admin2@hazel.com)
              </button>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-sm text-gray-600 mb-2">승인 상태별 테스트 계정:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@hazel.com');
                      setPassword('admin123');
                    }}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    👑 관리자 계정 (admin@hazel.com)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('test@hazel.com');
                      setPassword('password123');
                    }}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    ✅ 승인된 사용자 (test@hazel.com)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('pending@hazel.com');
                      setPassword('password123');
                    }}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    ⏳ 승인 대기 (pending@hazel.com)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('rejected@hazel.com');
                      setPassword('password123');
                    }}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    ❌ 승인 거부 (rejected@hazel.com)
                  </button>
                </div>
                <div className="mt-3 text-center text-xs text-gray-500">
                  승인 대기/거부 계정으로 로그인 시 접근이 제한됩니다.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

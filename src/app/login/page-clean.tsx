'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/services/auth'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authClient.signIn({
        email: formData.email,
        password: formData.password
      })

      console.log('로그인 성공:', result)
      alert('로그인 성공!')
      router.push('/')
    } catch (error) {
      console.error('로그인 오류:', error)
      
      let errorMessage = '로그인 중 오류가 발생했습니다.'
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '⚠️ 이메일 인증이 필요합니다.\n\nSupabase 대시보드에서:\n1. Authentication > Settings\n2. "Enable email confirmations" OFF\n3. Save 클릭\n\n또는 Authentication > Users에서 해당 사용자를 "Confirm" 하세요.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTestAccount = async () => {
    try {
      setLoading(true)
      await authClient.signUp({
        email: 'test@hazel.com',
        password: 'test123',
        name: '테스트 사용자'
      })
      
      alert('테스트 계정이 생성되었습니다!')
      setFormData({ email: 'test@hazel.com', password: 'test123' })
    } catch (error) {
      if (error instanceof Error && error.message.includes('User already registered')) {
        alert('테스트 계정이 이미 존재합니다!')
        setFormData({ email: 'test@hazel.com', password: 'test123' })
      } else {
        alert('계정 생성 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded whitespace-pre-line">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '로그인'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
              계정이 없으신가요? 회원가입
            </Link>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={createTestAccount}
                disabled={loading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                테스트 계정 생성/사용
              </button>
              <p className="text-xs text-gray-500 mt-2">
                test@hazel.com / test123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client";

import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // 오류를 콘솔에 로깅하되, 프로덕션에서는 외부 서비스로 전송 가능
    if (process.env.NODE_ENV === 'production') {
      // 예: 오류 로깅 서비스에 전송
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const resetError = () => {
        this.setState({ hasError: false, error: undefined });
      };

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={resetError} />;
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          resetError={resetError} 
        />
      );
    }

    return this.props.children;
  }
}

// 기본 에러 폴백 컴포넌트
function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          문제가 발생했습니다
        </h1>
        
        <p className="text-gray-600 mb-6">
          페이지를 불러오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <summary className="cursor-pointer text-red-800 font-medium">
              오류 상세 정보
            </summary>
            <pre className="mt-2 text-xs text-red-700 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetError}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </button>
          
          <Link 
            href="/"
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;

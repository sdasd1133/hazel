"use client";

import { useState } from "react";
import { Database, Check, AlertCircle, Copy } from 'lucide-react';

export default function InitDbPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitDb = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 먼저 연결 테스트
      const testResponse = await fetch('/api/test-connection', {
        method: 'GET',
      });
      const testData = await testResponse.json();
      
      if (!testData.success) {
        setError(`데이터베이스 연결 실패: ${testData.error}`);
        setLoading(false);
        return;
      }

      // 테이블 초기화 시도
      const response = await fetch('/api/init-users-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || '데이터베이스 초기화 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      setError('API 호출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('SQL이 클립보드에 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">데이터베이스 초기화</h1>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Supabase 데이터베이스에 사용자 관리를 위한 테이블을 생성합니다.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">주의사항</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    이 작업은 Supabase Dashboard의 SQL Editor에서 수동으로 실행해야 합니다.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleInitDb}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  처리 중...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  데이터베이스 초기화 SQL 생성
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">성공</h3>
                    <p className="mt-1 text-sm text-green-700">{result.message}</p>
                  </div>
                </div>
              </div>

              {result.instructions && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">실행 방법</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                    {result.instructions.map((instruction: string, index: number) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {result.sql && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-800">실행할 SQL</h3>
                    <button
                      onClick={() => copyToClipboard(result.sql)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      복사
                    </button>
                  </div>
                  <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
                    {result.sql}
                  </pre>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-amber-800 mb-2">다음 단계</h3>
                <p className="text-sm text-amber-700">
                  SQL 실행 후 회원가입을 하고 관리자 페이지에서 승인하면 자동으로 Supabase 데이터베이스에 등록됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

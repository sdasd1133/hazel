"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function InitDbPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitDb = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/init-db');
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message || '데이터베이스 초기화 실패');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Supabase 데이터베이스 초기화</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <p className="mb-4">이 페이지는 HAZEL 쇼핑몰의 Supabase 데이터베이스를 초기화합니다.</p>
        <p className="mb-4 text-amber-600 dark:text-amber-400 font-medium">주의: 이 작업은 기존 데이터를 덮어쓸 수 있습니다.</p>
        
        <Button 
          onClick={handleInitDb} 
          disabled={loading}
          className="mt-4"
        >
          {loading ? '초기화 중...' : '데이터베이스 초기화'}
        </Button>
        
        {message && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">데이터베이스 정보</h2>
        <ul className="space-y-2">
          <li><strong>Project URL:</strong> https://ctbdaguwxibcvlxohdqv.supabase.co</li>
          <li><strong>테이블:</strong> users, parent_categories, categories, products, product_images, product_sizes, product_colors, carts, cart_items</li>
        </ul>
      </div>
    </div>
  );
}

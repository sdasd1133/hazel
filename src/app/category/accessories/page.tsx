import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '악세사리 - HAZEL',
  description: '세련된 패션 악세사리 컬렉션. 목걸이, 귀걸이, 반지 등 스타일을 완성하는 악세사리',
};

export default function AccessoriesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="악세사리" />
    </Suspense>
  );
}

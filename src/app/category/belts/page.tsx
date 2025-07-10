import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '벨트 - HAZEL',
  description: '고급스럽고 실용적인 벨트 컬렉션. 가죽 벨트, 캐주얼 벨트 등 다양한 스타일',
};

export default function BeltsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="벨트" />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '남성 하의 - HAZEL',
  description: '남성을 위한 다양한 하의 컬렉션. 청바지, 슬랙스, 반바지, 트레이닝복 등 편안한 남성 하의',
};

export default function MenBottomsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="남성 하의" />
    </Suspense>
  );
}

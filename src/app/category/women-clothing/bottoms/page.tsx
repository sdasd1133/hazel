import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '여성 하의 - HAZEL',
  description: '여성을 위한 우아한 하의 컬렉션. 스커트, 바지, 원피스, 레깅스 등 다양한 여성 하의',
};

export default function WomenBottomsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="여성 하의" />
    </Suspense>
  );
}

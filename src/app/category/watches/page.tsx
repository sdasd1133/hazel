import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '시계 - HAZEL',
  description: '세련되고 정확한 시계 컬렉션. 클래식, 스포츠, 스마트워치 등 다양한 시계',
};

export default function WatchesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="시계" />
    </Suspense>
  );
}

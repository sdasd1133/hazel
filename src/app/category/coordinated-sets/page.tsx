import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '깔맞춤 - HAZEL',
  description: '완벽한 코디를 위한 깔맞춤 세트 상품. 스타일링이 완성된 세트 아이템',
};

export default function CoordinatedSetsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="깔맞춤" />
    </Suspense>
  );
}

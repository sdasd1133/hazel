import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '중고명품 - HAZEL',
  description: '검증된 중고 명품 컬렉션. 합리적인 가격으로 만나는 프리미엄 브랜드',
};

export default function UsedLuxuryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="중고명품" />
    </Suspense>
  );
}

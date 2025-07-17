import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '남성 상의 - HAZEL',
  description: '남성을 위한 다양한 상의 컬렉션. 티셔츠, 셔츠, 후드티, 니트 등 트렌디한 남성 상의',
};

export default function MenTopsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="남성 상의" />
    </Suspense>
  );
}

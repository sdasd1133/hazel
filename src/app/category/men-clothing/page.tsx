import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '남성의류 - HAZEL',
  description: '남성을 위한 다양한 스타일의 의류 상품을 만나보세요. 티셔츠, 셔츠, 바지 등 트렌디한 남성 패션 아이템',
};

export default function MenClothingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="남성의류" />
    </Suspense>
  );
}

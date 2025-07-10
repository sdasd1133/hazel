import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '여성의류 - HAZEL',
  description: '여성을 위한 세련된 의류 컬렉션. 블라우스, 원피스, 스커트 등 다양한 여성 패션 아이템',
};

export default function WomenClothingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="여성의류" />
    </Suspense>
  );
}

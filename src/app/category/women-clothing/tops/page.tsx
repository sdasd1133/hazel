import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '여성 상의 - HAZEL',
  description: '여성을 위한 세련된 상의 컬렉션. 블라우스, 티셔츠, 니트, 가디건 등 다양한 여성 상의',
};

export default function WomenTopsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="여성 상의" />
    </Suspense>
  );
}

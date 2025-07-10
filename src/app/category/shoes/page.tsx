import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '신발 - HAZEL',
  description: '편안하고 스타일리시한 신발 컬렉션. 스니커즈, 구두, 부츠 등 다양한 신발',
};

export default function ShoesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="신발" />
    </Suspense>
  );
}

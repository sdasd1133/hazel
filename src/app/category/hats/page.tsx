import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '모자 - HAZEL',
  description: '다양한 스타일의 모자 컬렉션. 캡, 비니, 버킷햇 등 패션 포인트가 되는 모자',
};

export default function HatsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="모자" />
    </Suspense>
  );
}

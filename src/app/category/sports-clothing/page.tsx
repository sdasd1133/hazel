import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '스포츠의류 - HAZEL',
  description: '운동과 활동적인 라이프스타일을 위한 스포츠웨어. 운동복, 아웃도어 의류 등',
};

export default function SportsClothingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="스포츠의류" />
    </Suspense>
  );
}

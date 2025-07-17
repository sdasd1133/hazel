impoexport const metadata: Metadata = {
  title: '가방&지갑 - HAZEL',
  description: '다양한 스타일의 가방과 지갑을 만나보세요. 핸드백, 백팩, 토트백, 지갑 등 실용적이고 세련된 아이템',
};

export default function BagsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="가방&지갑" />
    </Suspense>
  );
}e } from 'react';
import { Metadata } from 'next';
import CategoryProductsClient from '@/components/category-products-client';

export const metadata: Metadata = {
  title: '가방 - HAZEL',
  description: '다양한 스타일의 가방 컬렉션. 핸드백, 백팩, 크로스백 등 실용적이고 세련된 가방',
};

export default function BagsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <CategoryProductsClient category="가방" />
    </Suspense>
  );
}

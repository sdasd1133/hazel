"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Custom404() {
  const router = useRouter();

  // 클라이언트 측에서 경로 처리를 시도
  useEffect(() => {
    // 현재 URL 확인
    const path = window.location.pathname;
    console.log('404 페이지: 현재 경로', path);
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-6 text-gradient">페이지를 찾을 수 없습니다</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-lg">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다. 
        홈페이지로 이동하시거나 다시 시도해주세요.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.back()} variant="outline">
          이전 페이지로
        </Button>
        <Link href="/">
          <Button>홈으로 이동</Button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-dark/80 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 z-10 opacity-30 bg-[url('/hero-pattern.svg')]"></div>
        
        {/* 컨텐츠 */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-30 text-center">
          <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-6 text-white">2025 신상품 출시</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            2025 여름 컬렉션
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-xl text-white/90 mx-auto">
            트렌디하고 스타일리시한 의류로 여러분의 여름을 더욱 특별하게 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/products?category=티셔츠">
                <Button variant="gradient" size="lg" rounded className="group min-w-[180px]">
                  쇼핑하기 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Button variant="gradient" size="lg" rounded className="group min-w-[220px]" onClick={() => router.push('/login')}>
                로그인하고 쇼핑하기 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 프로모션 배너 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95"></div>
            <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10"></div>
            <div className="relative z-10 p-10 md:p-16 text-center md:text-left md:flex items-center justify-between">
              <div className="md:max-w-xl mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">신규 회원 10% 할인</h2>
                <p className="text-white/80 text-lg mb-6 max-w-md">
                  지금 회원가입하고 첫 구매 시 10% 할인 혜택을 받아보세요. 최신 트렌드의 의류를 특별한 가격에 만나보세요.
                </p>
                {!isAuthenticated && (
                  <Button onClick={() => router.push('/login')} variant="default" size="lg" rounded 
                    className="bg-white text-primary hover:bg-white/90 hover:scale-105 transform transition-all">
                    지금 시작하기
                  </Button>
                )}
              </div>
              <div className="hidden md:block relative w-64 h-64">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-primary font-bold">
                    <div className="text-5xl">10%</div>
                    <div className="text-xl">OFF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

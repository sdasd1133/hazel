"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/supabase-auth";
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
          <h1 className="text-4xl md:text-6xl font-bold mb-10 text-white">
            오셨습니까 형님!누님!
          </h1>
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
    </>
  );
}

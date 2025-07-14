"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // 관리자 페이지에서는 헤더와 푸터 없이 렌더링
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  // 일반 페이지에서는 헤더와 푸터 포함
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}

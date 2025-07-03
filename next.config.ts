import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify Next.js 플러그인은 정적 내보내기 대신 SSR을 지원합니다
  images: {
    domains: ['ctbdaguwxibcvlxohdqv.supabase.co'], // Supabase 도메인 추가
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true, // 슬래시로 끝나는 URL 처리
};

export default nextConfig;

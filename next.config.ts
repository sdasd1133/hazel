import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify Next.js 플러그인은 정적 내보내기 대신 SSR을 지원합니다
  typescript: {
    // !! WARN !!
    // 프로덕션 빌드 시 타입 오류 무시
    ignoreBuildErrors: true,
  },
  eslint: {
    // 프로덕션 빌드 시 ESLint 오류 무시
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['ctbdaguwxibcvlxohdqv.supabase.co', 'picsum.photos', 'images.unsplash.com'], // 이미지 도메인들 추가
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

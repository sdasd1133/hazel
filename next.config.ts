import type { NextConfig } from "next";
import path from "path";

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
  // React Strict Mode 비활성화 (일부 라이브러리 호환성 문제 해결)
  reactStrictMode: false,
  // 서버 외부 패키지 설정 (Next.js 15에서 변경됨)
  serverExternalPackages: ['@supabase/supabase-js'],
  // Webpack 설정 추가 (경로 해석 개선)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 절대 경로 별칭 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    return config;
  },
  // 런타임 설정
  poweredByHeader: false,
  // 압축 활성화
  compress: true,
  trailingSlash: true, // 슬래시로 끝나는 URL 처리
};

export default nextConfig;

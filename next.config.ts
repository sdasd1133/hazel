import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Netlify 환경 최적화
  output: 'standalone', // Netlify에서 더 나은 성능을 위해
  
  // 환경변수 기본값 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  },
  
  typescript: {
    // !! WARN !!
    // 프로덕션 빌드 시 타입 오류 무시 (임시)
    ignoreBuildErrors: true,
  },
  eslint: {
    // 프로덕션 빌드 시 ESLint 오류 무시 (임시)
    ignoreDuringBuilds: true,
  },
  
  // 이미지 최적화 설정
  images: {
    domains: ['ctbdaguwxibcvlxohdqv.supabase.co', 'picsum.photos', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Netlify에서 이미지 최적화 개선
    unoptimized: false,
  },
  
  // React 설정
  reactStrictMode: false, // 일부 라이브러리 호환성 문제 해결
  
  // 서버 외부 패키지 설정 (Next.js 15)
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // 성능 최적화
  poweredByHeader: false,
  compress: true,
  
  // 실험적 기능 (Next.js 15)
  experimental: {
    // turbo: {
    //   // Turbopack 최적화 (개발 환경)
    // },
    // 서버 액션 사용 (필요한 경우)
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.netlify.app"],
    },
    // hydration 안정성 개선
    optimizePackageImports: ['@/components', '@/lib', '@/hooks'],
  },
  
  // Webpack 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 절대 경로 별칭 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    // 외부 모듈 처리 (서버사이드에서만)
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@supabase/supabase-js');
    }
    
    return config;
  },
};

export default nextConfig;

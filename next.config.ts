import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 정적 HTML 내보내기 활성화
  images: {
    unoptimized: true, // 네트리파이에서 이미지 최적화를 위해
  },
  trailingSlash: true, // 슬래시로 끝나는 URL 처리
};

export default nextConfig;

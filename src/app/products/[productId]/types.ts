// Next.js 15 타입 선언
export interface ProductPageParams {
  productId: string;
}

// Netlify에서의 타입 에러 해결을 위한 선언
declare namespace NextJs {
  interface PageProps {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
}

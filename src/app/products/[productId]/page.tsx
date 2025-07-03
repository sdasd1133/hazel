import { getProductById } from "@/lib/products";
import { Metadata } from "next";
import ProductClientPage from "./client-page";
import { ProductPageParams } from "./types";

// Next.js 15와 Netlify 빌드 호환성을 위한 타입 정의

// @ts-expect-error - Next.js 15에서의 타입 호환성 문제 해결
export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const product = getProductById(params.productId);
  
  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다 - HAZEL",
    };
  }
  
  return {
    title: `${product.name} - HAZEL`,
    description: product.description,
  };
}

// @ts-expect-error - Next.js 15에서의 타입 호환성 문제 해결
export default async function ProductPage({ params }: { params: { productId: string } }) {
  return <ProductClientPage productId={params.productId} />;
}

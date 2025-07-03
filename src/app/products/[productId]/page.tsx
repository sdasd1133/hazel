// notFound는 ProductClientPage에서 사용됨
import { getProductById } from "@/lib/products";
import { Metadata } from "next";
import ProductClientPage from "./client-page";

// Next.js 15에서는 인라인 타입 정의 사용

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

export default function ProductPage({ params }: { params: { productId: string } }) {
  return <ProductClientPage productId={params.productId} />;
}

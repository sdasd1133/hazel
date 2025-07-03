// notFound는 ProductClientPage에서 사용됨
import { getProductById } from "@/lib/products";
import { Metadata } from "next";
import ProductClientPage from "./client-page";

// Next.js 15에서 타입 정의 수정
type ProductPageProps = {
  params: {
    productId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
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

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductClientPage productId={params.productId} />;
}

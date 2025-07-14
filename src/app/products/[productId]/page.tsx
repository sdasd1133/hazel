import { mainProductService } from "@/lib/services/main-products";
import { Metadata } from "next";
import ProductClientPage from "./client-page";

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  
  try {
    const product = await mainProductService.getProduct(parseInt(productId));
    
    if (!product) {
      return {
        title: "상품을 찾을 수 없습니다 - HAZEL",
      };
    }
    
    return {
      title: `${product.name} - HAZEL`,
      description: product.description || `${product.name} 상품 페이지`,
    };
  } catch (error) {
    console.error('Failed to load product for metadata:', error);
    return {
      title: "상품을 찾을 수 없습니다 - HAZEL",
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  return <ProductClientPage productId={productId} />;
}

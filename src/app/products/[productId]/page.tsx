import { getProductById } from "@/lib/products";
import { Metadata } from "next";
import ProductClientPage from "./client-page";

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);
  
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

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  return <ProductClientPage productId={productId} />;
}

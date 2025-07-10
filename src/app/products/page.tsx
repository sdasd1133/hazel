import { Metadata } from "next";
import ClientProductsPage from "./client-page";

export const metadata: Metadata = {
  title: "전체 상품 - HAZEL",
  description: "HAZEL의 모든 상품을 확인하세요.",
};

export default function ProductsPage() {
  return <ClientProductsPage />;
}
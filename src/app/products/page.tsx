import { Metadata } from "next";
import { Suspense } from "react";
import ClientProductsPage from "./client-page";

export const metadata: Metadata = {
  title: "전체 상품 - HAZEL",
  description: "HAZEL의 모든 상품을 확인하세요.",
};

function ProductsPageLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoading />}>
      <ClientProductsPage />
    </Suspense>
  );
}
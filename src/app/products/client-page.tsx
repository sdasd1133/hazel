"use client";

import { products, getCategories, getParentCategories, getCategoriesByParent, getProductsByParentCategory } from "@/lib/products";
import ProductCard from "@/components/ui/product-card";
import AuthCheck from "@/components/auth-check";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const parent = searchParams.get('parent') || undefined;
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  // 선택된 카테고리에 따른 상품 필터링
  let filteredProducts = [...products];
  let filteredCategories = [...categories];
  
  // 상위 카테고리 선택 시
  if (parent) {
    filteredProducts = getProductsByParentCategory(parent);
    filteredCategories = getCategoriesByParent(parent);
  } 
  // 하위 카테고리 선택 시
  else if (category) {
    filteredProducts = products.filter(product => 
      product.category.toLowerCase().replace(/\s+/g, '-') === category
    );
  }
  
  // 현재 선택된 상위 카테고리 확인
  const selectedParentCategory = parent
    ? parentCategories.find(cat => cat.id === parent)
    : undefined;

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {selectedParentCategory?.name || "전체 상품"}
        </h1>
        
        {/* 상위 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 border-b pb-4 mb-6">
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('parent');
                url.searchParams.delete('category');
                window.history.pushState({}, '', url);
                window.location.href = url.toString();
              }}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                !parent && !category
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            
            {parentCategories.map((parentCategory) => (
              <button
                key={parentCategory.id}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('parent', parentCategory.id);
                  url.searchParams.delete('category');
                  window.history.pushState({}, '', url);
                  window.location.href = url.toString();
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  parent === parentCategory.id
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {parentCategory.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 카테고리 필터 사이드바 */}
          <div className="w-full md:w-1/5 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">카테고리</h2>
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('category', category.id);
                        window.history.pushState({}, '', url);
                        window.location.href = url.toString();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        searchParams.get('category') === category.id
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">해당 카테고리에 상품이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}

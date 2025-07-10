"use client";

import { products, getCategories, getParentCategories, getCategoriesByParent, getProductsByParentCategory } from "@/lib/products";
import ProductCard from "@/components/ui/product-card";
import AuthCheck from "@/components/auth-check";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const parent = searchParams.get('parent') || undefined;
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([...products]);
  const [filteredCategories, setFilteredCategories] = useState([...categories]);
  
  // 상품 및 카테고리 필터링 로직을 useEffect로 이동
  useEffect(() => {
    try {
      let newFilteredProducts = [...products];
      let newFilteredCategories = [...categories];
      
      // 상위 카테고리 선택 시
      if (parent) {
        newFilteredProducts = getProductsByParentCategory(parent);
        newFilteredCategories = getCategoriesByParent(parent);
      } 
      // 하위 카테고리 선택 시
      else if (category) {
        newFilteredProducts = products.filter(product => 
          product.category.toLowerCase().replace(/\s+/g, '-') === category
        );
      }
      
      setFilteredProducts(newFilteredProducts);
      setFilteredCategories(newFilteredCategories);
    } catch (error) {
      console.error("상품 필터링 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [category, parent, categories, parentCategories]);
  
  // 현재 선택된 상위 카테고리 확인
  const selectedParentCategory = parent
    ? parentCategories.find(cat => cat.id === parent)
    : undefined;

  // 안전한 라우팅 이동 함수
  const navigateTo = (params) => {
    try {
      const newParams = new URLSearchParams();
      
      // 기존 파라미터 복사
      for (const [key, value] of searchParams.entries()) {
        if (!params.hasOwnProperty(key)) {
          newParams.set(key, value);
        }
      }
      
      // 새 파라미터 설정
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      }
      
      const query = newParams.toString();
      const path = `/products${query ? `?${query}` : ''}`;
      
      router.push(path);
    } catch (error) {
      console.error("라우팅 오류:", error);
    }
  };

  if (loading) {
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
              onClick={() => navigateTo({ parent: undefined, category: undefined })}
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
                onClick={() => navigateTo({ parent: parentCategory.id, category: undefined })}
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
                      onClick={() => navigateTo({ category: category.id })}
                      className="text-gray-700 hover:text-primary hover:underline"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-gray-500">해당 카테고리에 상품이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}

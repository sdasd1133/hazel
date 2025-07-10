"use client";

import { products, getCategories, getParentCategories, getCategoriesByParent, getProductsByParentCategory } from "@/lib/products";
import { getUrlFromCategory } from "@/lib/category-utils";
import ProductCard from "@/components/ui/product-card";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const parent = searchParams.get('parent') || undefined;
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  const [filteredProducts, setFilteredProducts] = useState([...products]);
  const [filteredCategories, setFilteredCategories] = useState([...categories]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 상품 및 카테고리 필터링 로직을 useEffect로 이동
  useEffect(() => {
    const filterProducts = () => {
      // 즉시 필터링하여 깜빡임 줄이기
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
      
      // 필터링 완료 후 로딩 상태 해제
      if (isLoading) {
        setTimeout(() => setIsLoading(false), 100);
      }
    };
    
    filterProducts();
  }, [category, parent, categories, parentCategories, isLoading]);
  
  // 현재 선택된 상위 카테고리 확인
  const selectedParentCategory = parent
    ? parentCategories.find(cat => cat.id === parent)
    : undefined;

  // 안전한 라우팅 이동 함수
  const navigateTo = (params: Record<string, string | undefined>) => {
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

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {selectedParentCategory?.name || "전체 상품"}
      </h1>
        
        {/* 상위 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 border-b pb-6 mb-6">
            <button
              onClick={() => navigateTo({ parent: undefined, category: undefined })}
              className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                !parent && !category
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
              }`}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                전체
              </span>
            </button>
            
            {parentCategories.map((parentCategory) => (
              <button
                key={parentCategory.id}
                onClick={() => navigateTo({ parent: parentCategory.id, category: undefined })}
                className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                  parent === parentCategory.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
                }`}
              >
                <span className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    parent === parentCategory.id ? "bg-white" : "bg-gray-400"
                  }`}></span>
                  {parentCategory.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 카테고리 필터 사이드바 */}
          <div className="w-full md:w-1/5 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  카테고리
                </h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-1">
                  {filteredCategories.map((categoryItem) => (
                    <div key={categoryItem.id}>
                      <Link
                        href={getUrlFromCategory(categoryItem.name)}
                        prefetch={false}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                          category === categoryItem.id
                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        }`}
                      >
                        <span className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-3 ${
                            category === categoryItem.id 
                              ? "bg-indigo-500" 
                              : "bg-gray-300 group-hover:bg-indigo-400"
                          }`}></span>
                          {categoryItem.name}
                        </span>
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            category === categoryItem.id 
                              ? "text-indigo-500 rotate-90" 
                              : "text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1"
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 로딩 스켈레톤 */}
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
  );
}

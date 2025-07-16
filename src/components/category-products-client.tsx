"use client";

import { products, getCategories, getParentCategories, getCategoriesByParent } from "@/lib/products";
import { getUrlFromCategory } from "@/lib/category-utils";
import ProductCard from "@/components/ui/product-card";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Home } from "lucide-react";
import Link from "next/link";
import { getAllProducts, getProductsByCategory } from "@/lib/services/main-products";

interface CategoryProductsClientProps {
  category: string;
}

export default function CategoryProductsClient({ category }: CategoryProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [expandedParentCategories, setExpandedParentCategories] = useState<string[]>([]);
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  // 현재 카테고리 정보 찾기
  const currentCategory = categories.find(cat => cat.name === category);
  const parentCategory = currentCategory ? 
    parentCategories.find(parent => parent.id === currentCategory.parentId) : null;

  // 현재 카테고리가 속한 상위 카테고리를 기본으로 펼침
  useEffect(() => {
    if (currentCategory && currentCategory.parentId) {
      setExpandedParentCategories(prev => 
        prev.includes(currentCategory.parentId!) 
          ? prev 
          : [...prev, currentCategory.parentId!]
      );
    }
  }, [currentCategory]);

  // 상위 카테고리 토글 함수
  const toggleParentCategory = (parentId: string) => {
    setExpandedParentCategories(prev => 
      prev.includes(parentId) 
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    );
  };

  // 수동 새로고침 함수
  const refreshProducts = () => {
    setLastRefresh(Date.now());
  };
  
  useEffect(() => {
    const filterProducts = async () => {
      setIsLoading(true);
      try {
        // 카테고리별 상품 직접 조회 (DB에서 category_id로 필터링)
        const categoryProducts = await getProductsByCategory(category);
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error('상품 데이터 로드 실패:', error);
        // 오류 시 빈 배열 표시
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    filterProducts();
  }, [category, lastRefresh]); // lastRefresh를 의존성에 추가
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary flex items-center">
          <Home className="w-4 h-4 mr-1" />
          홈
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-primary">
          전체 상품
        </Link>
        <ChevronRight className="w-4 h-4" />
        {parentCategory && (
          <>
            <Link 
              href={`/products?parent=${parentCategory.id}`} 
              className="hover:text-primary"
            >
              {parentCategory.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-foreground font-medium">{category}</span>
      </div>
      
      {/* 카테고리 헤더 */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{category}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length}개의 상품이 있습니다
          </p>
        </div>
        <button
          onClick={refreshProducts}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '로딩 중...' : '새로고침'}
        </button>
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
              <div className="space-y-2">
                {parentCategories.map((parentCat) => {
                  const childCategories = getCategoriesByParent(parentCat.id);
                  const isExpanded = expandedParentCategories.includes(parentCat.id);
                  
                  return (
                    <div key={parentCat.id} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                      {/* 상위 카테고리 헤더 */}
                      <button
                        onClick={() => toggleParentCategory(parentCat.id)}
                        className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group hover:bg-gray-50"
                      >
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full mr-3 bg-indigo-400"></span>
                          <span className="font-medium text-gray-800">{parentCat.name}</span>
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                        )}
                      </button>
                      
                      {/* 하위 카테고리 목록 */}
                      {isExpanded && (
                        <div className="mt-1 ml-4 space-y-1">
                          {childCategories.map((categoryItem) => (
                            <button
                              key={categoryItem.id}
                              onClick={() => {
                                const url = getUrlFromCategory(categoryItem.name);
                                window.location.href = url;
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                                category === categoryItem.name
                                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 text-indigo-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                              }`}
                            >
                              <span className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-3 ${
                                  category === categoryItem.name 
                                    ? "bg-indigo-500" 
                                    : "bg-gray-300 group-hover:bg-indigo-400"
                                }`}></span>
                                <span className="text-sm">{categoryItem.name}</span>
                              </span>
                              <svg 
                                className={`w-3 h-3 transition-transform duration-200 ${
                                  category === categoryItem.name 
                                    ? "text-indigo-500" 
                                    : "text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1"
                                }`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="flex-1">
          {/* 상품 그리드 */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">상품이 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                {category} 카테고리에 등록된 상품이 없습니다.
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                전체 상품 보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

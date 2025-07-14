"use client";

import { products, getCategories, getParentCategories } from "@/lib/products";
import { getUrlFromCategory } from "@/lib/category-utils";
import ProductCard from "@/components/ui/product-card";
import { useState, useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { getAllProducts } from "@/lib/services/main-products";

interface CategoryProductsClientProps {
  category: string;
}

export default function CategoryProductsClient({ category }: CategoryProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  // 현재 카테고리 정보 찾기
  const currentCategory = categories.find(cat => cat.name === category);
  const parentCategory = currentCategory ? 
    parentCategories.find(parent => parent.id === currentCategory.parentId) : null;
  
  useEffect(() => {
    const filterProducts = async () => {
      setIsLoading(true);
      try {
        console.log('카테고리별 상품 로딩 시작:', category);
        
        // 데이터베이스에서 모든 상품 가져오기
        const allProducts = await getAllProducts();
        console.log('전체 상품 데이터:', allProducts);
        
        // 현재 카테고리에 맞는 상품 필터링
        const categoryProducts = allProducts.filter(product => {
          console.log(`상품 "${product.name}"의 카테고리:`, product.category, '찾는 카테고리:', category);
          return product.category === category;
        });
        
        console.log('필터링된 카테고리 상품:', categoryProducts);
        
        // 하드코딩된 상품도 포함 (기존 데모 상품)
        const hardcodedProducts = products.filter(product => product.category === category);
        console.log('하드코딩된 상품:', hardcodedProducts);
        
        // 두 데이터 소스 합치기
        const allCategoryProducts = [...categoryProducts, ...hardcodedProducts];
        console.log('최종 표시될 상품:', allCategoryProducts);
        
        setFilteredProducts(allCategoryProducts);
      } catch (error) {
        console.error('상품 데이터 로드 실패:', error);
        // 오류 시 하드코딩된 상품만 표시
        const categoryProducts = products.filter(product => product.category === category);
        setFilteredProducts(categoryProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    filterProducts();
  }, [category]);
  
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category}</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length}개의 상품이 있습니다
        </p>
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
                {categories.map((categoryItem) => (
                  <div key={categoryItem.id}>
                    <button
                      onClick={() => {
                        const url = getUrlFromCategory(categoryItem.name);
                        console.log('카테고리 클릭:', categoryItem.name, '→', url);
                        window.location.href = url;
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        category === categoryItem.name
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 text-indigo-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      }`}
                    >
                      <span className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-3 ${
                          category === categoryItem.name 
                            ? "bg-indigo-500" 
                            : "bg-gray-300 group-hover:bg-indigo-400"
                        }`}></span>
                        {categoryItem.name}
                      </span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          category === categoryItem.name 
                            ? "text-indigo-500 rotate-90" 
                            : "text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1"
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="flex-1">
          {/* 상품 그리드 */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

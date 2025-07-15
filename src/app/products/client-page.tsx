"use client";

import { mainProductService, type MainProduct, convertMainProductsToProducts } from "@/lib/services/main-products";
import { getCategories, getParentCategories, getCategoriesByParent } from "@/lib/products";
import { getUrlFromCategory } from "@/lib/category-utils";
import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const parent = searchParams.get('parent') || undefined;
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredCategories, setFilteredCategories] = useState([...categories]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [expandedParentCategories, setExpandedParentCategories] = useState<string[]>([]);

  // 수동 새로고침 함수
  const refreshProducts = () => {
    setLastRefresh(Date.now());
  };

  // 상위 카테고리 토글 함수
  const toggleParentCategory = (parentId: string) => {
    setExpandedParentCategories(prev => 
      prev.includes(parentId) 
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    );
  };

  // 데이터베이스에서 상품 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading products from database...');
        
        const mainProducts = await mainProductService.getActiveProducts();
        console.log('Raw products from DB:', mainProducts);
        
        const dbProducts = convertMainProductsToProducts(mainProducts);
        console.log('Converted DB products:', dbProducts);
        
        // 데이터베이스 상품만 사용
        console.log('All products from DB:', dbProducts.length);
        console.log('Products with categories:', dbProducts.map(p => ({ name: p.name, category: p.category })));
        
        setAllProducts(dbProducts);
        setFilteredProducts(dbProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('상품을 불러오는데 실패했습니다.');
        // 데이터베이스 오류 시 빈 배열 사용
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [lastRefresh]); // lastRefresh를 의존성에 추가
  
  // 상품 및 카테고리 필터링 로직
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    const filterProducts = () => {
      console.log('필터링 시작 - parent:', parent, 'category:', category);
      
      let newFilteredProducts = [...allProducts];
      let newFilteredCategories = [...categories];
      
      // 상위 카테고리 선택 시
      if (parent) {
        console.log('상위 카테고리 필터링:', parent);
        newFilteredCategories = getCategoriesByParent(parent);
        
        // 상위 카테고리에 속하는 하위 카테고리들의 이름 목록 생성
        const childCategoryNames = newFilteredCategories.map(cat => cat.name);
        
        // 해당 카테고리에 속하는 상품 필터링
        newFilteredProducts = allProducts.filter(product => 
          childCategoryNames.includes(product.category)
        );
        
        console.log('필터링된 상품 수:', newFilteredProducts.length);
        console.log('필터링된 카테고리:', newFilteredCategories.map(c => c.name));
      } 
      // 하위 카테고리 선택 시
      else if (category) {
        console.log('하위 카테고리 필터링:', category);
        
        // 카테고리 slug를 이름으로 변환
        const categoryObj = categories.find(cat => 
          cat.id.replace(/\s+/g, '-').toLowerCase() === category
        );
        
        if (categoryObj) {
          newFilteredProducts = allProducts.filter(product => 
            product.category === categoryObj.name
          );
        }
      }
      
      setFilteredProducts(newFilteredProducts);
      setFilteredCategories(newFilteredCategories);
    };
    
    filterProducts();
  }, [category, parent, allProducts]);
  
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

      {/* 에러 표시 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 underline hover:no-underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 - 로딩 중이 아닐 때만 표시 */}
      {!isLoading && !error && (
        <>
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
                                  console.log('카테고리 클릭:', categoryItem.name, '→', url);
                                  window.location.href = url;
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                                  category === categoryItem.id
                                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 text-indigo-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                                }`}
                              >
                                <span className="flex items-center">
                                  <span className={`w-1.5 h-1.5 rounded-full mr-3 ${
                                    category === categoryItem.id 
                                      ? "bg-indigo-500" 
                                      : "bg-gray-300 group-hover:bg-indigo-400"
                                  }`}></span>
                                  <span className="text-sm">{categoryItem.name}</span>
                                </span>
                                <svg 
                                  className={`w-3 h-3 transition-transform duration-200 ${
                                    category === categoryItem.id 
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
            {/* 상품 목록 헤더 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                상품 목록 ({filteredProducts.length}개)
              </h2>
              <button
                onClick={refreshProducts}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '로딩 중...' : '새로고침'}
              </button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
        </>
      )}
    </div>
  );
}

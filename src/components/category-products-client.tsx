"use client";

import { products, getCategories, getParentCategories } from "@/lib/products";
import ProductCard from "@/components/ui/product-card";
import { useState, useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface CategoryProductsClientProps {
  category: string;
}

export default function CategoryProductsClient({ category }: CategoryProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState([...products]);
  const [isLoading, setIsLoading] = useState(true);
  
  const parentCategories = getParentCategories();
  const categories = getCategories();
  
  // 현재 카테고리 정보 찾기
  const currentCategory = categories.find(cat => cat.name === category);
  const parentCategory = currentCategory ? 
    parentCategories.find(parent => parent.id === currentCategory.parentId) : null;
  
  useEffect(() => {
    const filterProducts = () => {
      const categoryProducts = products.filter(product => product.category === category);
      setFilteredProducts(categoryProducts);
      setIsLoading(false);
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
      
      {/* 상품 그리드 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
  );
}

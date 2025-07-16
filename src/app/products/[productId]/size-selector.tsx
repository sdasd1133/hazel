"use client";

import { useMemo } from "react";
import { Product } from "@/types";

interface SizeSelectorProps {
  product: Product;
  productId: string;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export function SizeSelector({ product, productId, selectedSize, setSelectedSize }: SizeSelectorProps) {
  const sizes = [
    { label: 'M (95)', value: 'M' },
    { label: 'L (100)', value: 'L' },
    { label: 'XL (105)', value: 'XL' },
    { label: '2XL (110)', value: '2XL' }
  ];

  // 사이즈 선택이 필요 없는 카테고리 확인
  const shouldShowSizeSelection = useMemo(() => {
    if (!product?.category) return false;
    
    const noSizeCategories = ['가방', '시계', '악세사리'];
    const categoryStr = product.category.toString().toLowerCase().trim();
    
    // 디버깅 로그 (임시)
    if (productId === '12') {
      console.log('🔍 SizeSelector shouldShowSizeSelection 디버깅:', {
        productCategory: product.category,
        categoryStr,
        noSizeCategories,
        shouldShow: !noSizeCategories.some(cat => categoryStr.includes(cat.toLowerCase()))
      });
    }
    
    // 가방, 시계, 악세사리 카테고리에서는 사이즈 선택 숨김
    return !noSizeCategories.some(cat => 
      categoryStr.includes(cat.toLowerCase())
    );
  }, [product?.category, productId]);

  // 사이즈 선택이 필요 없는 카테고리면 렌더링하지 않음
  if (!shouldShowSizeSelection) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2 flex items-center">
        <span className="w-4 h-4 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
        </span>
        사이즈 선택 <span className="text-red-500 ml-1">*</span>
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => setSelectedSize(size.value)}
            className={`py-2 px-3 border-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${
              selectedSize === size.value
                ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}

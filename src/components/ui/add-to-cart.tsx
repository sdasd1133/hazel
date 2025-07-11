"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useCartStore } from "@/lib/cartStore";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    
    addItem(product, 1, selectedSize, selectedColor);
    
    // 추가 후 성공 메시지 표시 등 추가 가능
  };

  return (
    <div>
      {/* 사이즈 선택 */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">사이즈</h2>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-md px-4 py-2 font-medium transition-colors ${
                selectedSize === size
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {selectedSize === null && (
          <p className="text-sm text-red-500 mt-2">사이즈를 선택해주세요</p>
        )}
      </div>
      
      {/* 색상 선택 */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-3">색상</h2>
        <div className="flex flex-wrap gap-3">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`rounded-md px-4 py-2 font-medium transition-colors ${
                selectedColor === color
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
        {selectedColor === null && (
          <p className="text-sm text-red-500 mt-2">색상을 선택해주세요</p>
        )}
      </div>
      
      {/* 장바구니 담기 버튼 */}
      <div className="mt-10">
        <Button 
          className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white" 
          disabled={!product.inStock || !selectedSize || !selectedColor}
          onClick={handleAddToCart}
        >
          {product.inStock ? "장바구니에 담기" : "품절"}
        </Button>
      </div>
    </div>
  );
}

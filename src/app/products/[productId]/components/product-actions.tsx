"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface ProductActionsProps {
  product: Product;
}

const ProductActions = ({ product }: ProductActionsProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore((state) => state.addItem);

  // 장바구니에 상품 추가
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      setError("사이즈를 선택해주세요.");
      return;
    }

    if (!selectedColor && product.colors.length > 0) {
      setError("색상을 선택해주세요.");
      return;
    }

    // 장바구니에 상품 추가
    addToCart(product, quantity, selectedSize, selectedColor);
    
    // 에러 초기화 및 사용자에게 피드백 제공
    setError(null);
    alert("장바구니에 상품이 추가되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* 사이즈 선택 */}
      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">사이즈</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md text-sm ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 색상 선택 */}
      {product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">색상</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-md text-sm ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 수량 선택 */}
      <div>
        <h3 className="text-sm font-medium mb-2">수량</h3>
        <div className="flex items-center border border-gray-200 rounded-md w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-lg"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1 text-center min-w-[40px]">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 장바구니 버튼 */}
      <Button
        onClick={handleAddToCart}
        className="w-full py-6"
        disabled={!product.inStock}
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {product.inStock ? "장바구니에 추가" : "품절"}
      </Button>
    </div>
  );
};

export default ProductActions;

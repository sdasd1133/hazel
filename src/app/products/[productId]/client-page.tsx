"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";

interface ProductClientPageProps {
  productId: string;
}

export default function ProductClientPage({ productId }: ProductClientPageProps) {
  const product = getProductById(productId);
  const { addItem } = useCartStore();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!product) {
    notFound();
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Gray', 'Navy'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    
    addItem(product, quantity, selectedSize, selectedColor);
    
    alert('장바구니에 추가되었습니다.');
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 상품 이미지 */}
        <div>
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.images[selectedImageIndex] ? (
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">📷</span>
              </div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* 상품 정보 */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-indigo-600">{product.price.toLocaleString()}원</p>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          
          {/* 색상 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">색상</h3>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    selectedColor === color
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 사이즈 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">사이즈 <span className="text-red-500">*</span></h3>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 수량 선택 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">수량</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-16 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* 구매 버튼들 */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              장바구니에 추가
            </button>
            <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              바로 구매하기
            </button>
          </div>

          {/* 배송 정보 */}
          <div className="border-t pt-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="font-medium text-gray-700 min-w-[80px]">배송</span>
              <div>
                <p className="text-gray-600">3,000원 (70,000원 이상 구매 시 무료배송)</p>
                <p className="text-sm text-gray-500 mt-1">제주 및 도서산간 지역은 추가 배송비 발생</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="font-medium text-gray-700 min-w-[80px]">교환/반품</span>
              <div>
                <p className="text-gray-600">상품 수령 후 7일 이내 교환/반품 가능</p>
                <p className="text-sm text-gray-500 mt-1">단순 변심에 의한 교환/반품 시 배송비 고객 부담</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

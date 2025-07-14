"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";

interface ProductClientPageProps {
  productId: string;
}

export default function ProductClientPage({ productId }: ProductClientPageProps) {
  const product = getProductById(productId);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold mt-4">{product.price.toLocaleString()}원</p>
          
          <div className="mt-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="mt-8">
            <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
              장바구니에 추가
            </button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="font-medium min-w-[80px]">배송</span>
              <div>
                <p>3,000원 (70,000원 이상 구매 시 무료배송)</p>
                <p className="text-sm text-gray-500 mt-1">제주 및 도서산간 지역은 추가 배송비 발생</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4">
            <div className="flex items-start gap-3">
              <span className="font-medium min-w-[80px]">교환/반품</span>
              <div>
                <p>상품 수령 후 7일 이내 교환/반품 가능</p>
                <p className="text-sm text-gray-500 mt-1">단순 변심에 의한 교환/반품 시 배송비 고객 부담</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

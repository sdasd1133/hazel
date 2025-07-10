"use client";

import { useState } from 'react';
import AuthCheck from '@/components/auth-check';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedDate: string;
}

// 더미 데이터
const dummyWishlist: WishlistItem[] = [
  {
    id: '1',
    name: '클래식 화이트 셔츠',
    price: 45000,
    originalPrice: 55000,
    image: '/images/shirt-white.jpg',
    category: '셔츠',
    inStock: true,
    addedDate: '2025-01-09'
  },
  {
    id: '2',
    name: '울 코트',
    price: 156000,
    image: '/images/coat-wool.jpg',
    category: '아우터',
    inStock: false,
    addedDate: '2025-01-08'
  },
  {
    id: '3',
    name: '데님 자켓',
    price: 89000,
    originalPrice: 99000,
    image: '/images/jacket-denim.jpg',
    category: '자켓',
    inStock: true,
    addedDate: '2025-01-07'
  }
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(dummyWishlist);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = () => {
    setSelectedItems(wishlistItems.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const removeSelected = () => {
    setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const addSelectedToCart = () => {
    const availableItems = wishlistItems.filter(item => 
      selectedItems.includes(item.id) && item.inStock
    );
    
    if (availableItems.length > 0) {
      alert(`${availableItems.length}개 상품이 장바구니에 추가되었습니다.`);
      // 실제로는 장바구니 상태에 추가하는 로직이 필요
    } else {
      alert('선택한 상품 중 재고가 있는 상품이 없습니다.');
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">찜목록</h1>
            <p className="text-gray-600 mt-2">관심있는 상품들을 모아두었습니다.</p>
          </div>

          {wishlistItems.length > 0 ? (
            <>
              {/* 상단 컨트롤 */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      총 {wishlistItems.length}개 상품
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={selectAll}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        전체선택
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={deselectAll}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        선택해제
                      </button>
                    </div>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {selectedItems.length}개 선택됨
                      </span>
                      <button
                        onClick={addSelectedToCart}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        장바구니 담기
                      </button>
                      <button
                        onClick={removeSelected}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        선택삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 위시리스트 상품 목록 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative">
                      {/* 체크박스 */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                      
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50"
                      >
                        <span className="text-gray-400 hover:text-red-500">✕</span>
                      </button>

                      {/* 상품 이미지 */}
                      <div className="aspect-square bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">👕</span>
                      </div>
                      
                      {/* 품절 오버레이 */}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">SOLD OUT</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900">
                            {item.price.toLocaleString()}원
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {item.originalPrice.toLocaleString()}원
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        {item.addedDate} 추가
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/products/${item.id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm text-center hover:bg-gray-200 transition-colors"
                        >
                          상품보기
                        </Link>
                        <button
                          disabled={!item.inStock}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                            item.inStock
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {item.inStock ? '장바구니' : '품절'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">찜목록이 비어있습니다</h3>
              <p className="text-gray-500 mb-6">마음에 드는 상품을 찜해보세요!</p>
              <Link 
                href="/products"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
              >
                상품 둘러보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}

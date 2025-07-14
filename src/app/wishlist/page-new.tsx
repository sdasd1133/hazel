'use client';

import { useState } from 'react';
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

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
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
    } else {
      alert('선택한 상품 중 재고가 있는 상품이 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">찜목록</h1>
          <p className="text-gray-600 mt-2">관심있는 상품들을 모아두었습니다.</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-gray-500 mb-4">찜한 상품이 없습니다.</p>
              <Link 
                href="/products"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
              >
                상품 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === wishlistItems.length}
                      onChange={selectedItems.length === wishlistItems.length ? deselectAll : selectAll}
                      className="rounded"
                    />
                    <span className="ml-2">전체선택</span>
                  </label>
                  <span className="text-gray-500">
                    {selectedItems.length}개 선택
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={addSelectedToCart}
                    disabled={selectedItems.length === 0}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
                  >
                    선택상품 장바구니
                  </button>
                  <button
                    onClick={removeSelected}
                    disabled={selectedItems.length === 0}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300"
                  >
                    선택삭제
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded"
                      />
                    </label>
                    
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-lg">{item.price.toLocaleString()}원</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {item.originalPrice.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      {!item.inStock && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-2">
                          품절
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

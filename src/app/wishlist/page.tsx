"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useAuthStore } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cartStore';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!user) {
      router.push('/login?redirect=/wishlist');
      return;
    }

    loadWishlist();
  }, [user, router]);

  const loadWishlist = () => {
    try {
      // 로컬 스토리지에서 찜한 상품 목록 로드
      const savedWishlist = localStorage.getItem(`wishlist_${user?.id || 'guest'}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('찜 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    
    try {
      localStorage.setItem(`wishlist_${user?.id || 'guest'}`, JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('찜 목록 저장 오류:', error);
    }
  };

  const addToCart = (product: Product) => {
    addItem(product, 1);
    alert('장바구니에 추가되었습니다.');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">찜한 상품을 보려면 로그인해주세요.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">찜한 상품</h1>
            <p className="text-gray-600">마음에 든 상품들을 모아보세요</p>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  {/* 상품 이미지 */}
                  <div className="relative aspect-square">
                    <Link href={`/products/${product.id}`}>
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">이미지 없음</span>
                        </div>
                      )}
                    </Link>
                    
                    {/* 찜 삭제 버튼 */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* 할인 배지 */}
                    {product.price > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* 가격 */}
                    <div className="mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString()}원
                      </span>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm">장바구니</span>
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2 border border-gray-300 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">찜한 상품이 없습니다</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                마음에 드는 상품을 찜해보세요. 나중에 쉽게 찾아볼 수 있습니다.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                상품 둘러보기
              </Link>
            </div>
          )}

          {/* 하단 링크 */}
          {wishlistItems.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ShoppingBag className="h-5 w-5" />
                더 많은 상품 보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

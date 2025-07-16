"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import { mainProductService, convertMainProductToProduct } from "@/lib/services/main-products";
import { products as fallbackProducts } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { Product } from "@/types";

interface ProductClientPageProps {
  productId: string;
}

export default function ProductClientPage({ productId }: ProductClientPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 상품 데이터 로드
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading product:', productId);
        
        // 먼저 DB에서 상품 검색
        try {
          const mainProduct = await mainProductService.getProduct(parseInt(productId));
          
          if (mainProduct) {
            const convertedProduct = convertMainProductToProduct(mainProduct);
            console.log('Loaded product from DB:', convertedProduct);
            setProduct(convertedProduct);
            return;
          }
        } catch (dbError) {
          console.log('DB 조회 실패, fallback 상품에서 검색:', dbError);
        }
        
        // DB에서 찾지 못했거나 오류가 발생하면 fallback 상품에서 검색
        const fallbackProduct = fallbackProducts.find(p => p.id === productId);
        
        if (fallbackProduct) {
          console.log('Loaded product from fallback:', fallbackProduct);
          setProduct(fallbackProduct);
        } else {
          console.log('Product not found:', productId);
          notFound();
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        setError('상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (!product) {
    notFound();
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Gray', 'Navy'];
  
  // 사이즈 선택이 필요 없는 카테고리 확인
  const shouldShowSizeSelection = () => {
    if (!product.category) return true; // 카테고리 정보가 없으면 사이즈 선택 표시
    
    const noSizeCategories = ['가방', '시계', '악세사리'];
    return !noSizeCategories.some(cat => 
      product.category?.toLowerCase().includes(cat.toLowerCase())
    );
  };

  const handleAddToCart = () => {
    // 사이즈 선택이 필요한 카테고리에서만 사이즈 확인
    if (shouldShowSizeSelection() && !selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    
    addItem(product, quantity, selectedSize, selectedColor);
    
    alert('장바구니에 추가되었습니다.');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      alert('찜 목록에서 제거되었습니다.');
    } else {
      addToWishlist(product);
      alert('찜 목록에 추가되었습니다.');
    }
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* 상품 이미지 섹션 */}
        <div className="lg:col-span-2">
          <div className="max-w-lg mx-auto lg:ml-auto lg:mr-4">
            <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4 max-h-96 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {product.images && product.images.length > 0 && product.images[selectedImageIndex] && 
               !product.images[selectedImageIndex].includes('placeholder') ? (
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  unoptimized={true}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-medium text-gray-700 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">이미지 준비 중</p>
                  </div>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImageIndex === index ? 'border-indigo-500 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {image && !image.includes('placeholder') ? (
                      <Image
                        src={image}
                        alt={`${product.name} 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 상품 설명 - 이미지 하단으로 이동 */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">상품 정보</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
        
        {/* 상품 옵션 및 구매 섹션 - 크기 축소 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-8">
            {/* 상품 기본 정보 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Collection</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {product.price.toLocaleString()}원
                </p>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  무료배송
                </span>
              </div>
            </div>
            
            {/* 색상 선택 */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <span className="w-4 h-4 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
                색상 선택
              </h3>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border-2 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 ${
                      selectedColor === color
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* 사이즈 선택 - 특정 카테고리에만 표시 */}
            {shouldShowSizeSelection() && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center">
                  <span className="w-4 h-4 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                  사이즈 선택 <span className="text-red-500 ml-1">*</span>
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 border-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                        selectedSize === size
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 수량 선택 */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <span className="w-4 h-4 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
                수량
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 font-semibold text-sm"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold bg-gradient-to-r from-gray-100 to-gray-200 py-1.5 rounded-lg text-sm">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 font-semibold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* 구매 버튼들 */}
            <div className="space-y-3 mb-5">
              {/* 찜하기 버튼 */}
              <button
                onClick={handleWishlistToggle}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border-2 hover:scale-105 ${
                  isInWishlist(product.id)
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-600 hover:shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                {isInWishlist(product.id) ? '찜 취소' : '찜하기'}
              </button>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
              >
                🛒 장바구니에 추가
              </button>
              <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg font-bold hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm">
                ⚡ 바로 구매하기
              </button>
            </div>

            {/* 배송 정보 - 축소 */}
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-800">
                <span className="w-5 h-5 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                </span>
                배송 & 교환/반품 정보
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.68 5.39A3 3 0 008.49 15H15a1 1 0 000-2H8.49a1 1 0 01-.96-.73L6.92 10h8.08a1 1 0 00.95-.68l1.25-4A1 1 0 0016.2 4H3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">배송비</p>
                    <p className="text-xs text-gray-600">3,000원 (70,000원 이상 무료)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">교환/반품</p>
                    <p className="text-xs text-gray-600">상품 수령 후 7일 이내 가능</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

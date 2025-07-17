"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { Product } from "@/types";

interface ProductOptionsProps {
  product: Product;
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // 전체 사이즈 목록 (관리자에서 선택할 수 있는 사이즈들)
  const allClothingSizes = [
    { label: 'M (95)', value: 'M' },
    { label: 'L (100)', value: 'L' },
    { label: 'XL (105)', value: 'XL' },
    { label: '2XL (110)', value: '2XL' }
  ];

  // 신발 사이즈 목록 (한국 기준 mm + 유럽 사이즈)
  const allShoeSizes = [
    { label: '220', value: '220' },
    { label: '225', value: '225' },
    { label: '230', value: '230' },
    { label: '235', value: '235' },
    { label: '240', value: '240' },
    { label: '245', value: '245' },
    { label: '250', value: '250' },
    { label: '255', value: '255' },
    { label: '260', value: '260' },
    { label: '265', value: '265' },
    { label: '270', value: '270' },
    { label: '275', value: '275' },
    { label: '280', value: '280' },
    { label: '285', value: '285' },
    { label: '290', value: '290' },
    { label: '295', value: '295' },
    { label: '300', value: '300' },
    // 유럽 사이즈 (관리자에서 설정한 사이즈)
    { label: '36', value: '36' },
    { label: '37', value: '37' },
    { label: '38', value: '38' },
    { label: '39', value: '39' },
    { label: '40', value: '40' },
    { label: '41', value: '41' },
    { label: '42', value: '42' },
    { label: '43', value: '43' },
    { label: '44', value: '44' }
  ];

  // 바지 사이즈 목록 (inch 단위)
  const allPantsSizes = [
    { label: '30', value: '30' },
    { label: '32', value: '32' },
    { label: '34', value: '34' },
    { label: '36', value: '36' },
    { label: '38', value: '38' },
    { label: '40', value: '40' }
  ];

  // 카테고리에 따라 사이즈 목록 선택
  const isShoeCategory = product.category && 
    (product.category.toString().toLowerCase().includes('신발') || 
     product.category.toString().toLowerCase().includes('shoe'));

  // 바지 카테고리 감지 추가
  const isPantsCategory = product.category && 
    (product.category.toString().toLowerCase().includes('바지') || 
     product.category.toString().toLowerCase().includes('pants') || 
     product.category.toString().toLowerCase().includes('하의'));

  // 바지 사이즈 필터링 (tags에서 pantssize: 프리픽스로 저장된 사이즈 추출)
  const availablePantsSizes = product.tags 
    ? allPantsSizes.filter(size => 
        product.tags!.some(tag => tag.startsWith('pantssize:') && tag.includes(size.value))
      )
    : [];

  // 신발 사이즈 필터링 (tags에서 shoesize: 프리픽스로 저장된 사이즈 추출)
  const availableShoeSizes = product.tags 
    ? allShoeSizes.filter(size => 
        product.tags!.some(tag => tag.startsWith('shoesize:') && tag.includes(size.value))
      )
    : [];

  // 카테고리와 실제 데이터에 따라 사이즈 목록 결정
  let allSizes = allClothingSizes;
  if (isShoeCategory && availableShoeSizes.length > 0) {
    allSizes = allShoeSizes;
  } else if (isPantsCategory && availablePantsSizes.length > 0) {
    allSizes = allPantsSizes;
  }

  // 상품에 지정된 사이즈만 필터링
  const availableSizes = allSizes.filter(size => 
    product.sizes && product.sizes.includes(size.value)
  );

  // 상품에 사이즈가 지정되지 않은 경우 기본 사이즈 사용
  const sizes = availableSizes.length > 0 ? availableSizes : allSizes;
  
  // 전체 색상 목록 (관리자에서 선택할 수 있는 색상들)
  const allColors = [
    { label: '블랙', value: 'Black' },
    { label: '화이트', value: 'White' },
    { label: '그레이', value: 'Gray' },
    { label: '네이비', value: 'Navy' },
    { label: '레드', value: 'Red' },
    { label: '블루', value: 'Blue' },
    { label: '그린', value: 'Green' },
    { label: '옐로우', value: 'Yellow' },
    { label: '핑크', value: 'Pink' },
    { label: '퍼플', value: 'Purple' },
    { label: '오렌지', value: 'Orange' },
    { label: '브라운', value: 'Brown' },
    { label: '베이지', value: 'Beige' },
    { label: '카키', value: 'Khaki' },
    { label: '마젠타', value: 'Magenta' },
    { label: '민트', value: 'Mint' }
  ];

  // 상품에 지정된 색상만 필터링
  const availableColors = allColors.filter(color => 
    product.colors && product.colors.includes(color.value)
  );

  // 상품에 색상이 지정되지 않은 경우 빈 배열로 설정 (색상 선택 UI 숨김)
  const colors = availableColors.length > 0 ? availableColors : [];

  // 사이즈 선택이 필요한 카테고리 확인
  const shouldShowSizeSelection = () => {
    if (!product?.category) return false;
    
    const noSizeCategories = ['가방', '시계', '악세사리'];
    const categoryStr = product.category.toString().toLowerCase().trim();
    
    // 디버깅 로그
    console.log('🔍 ProductOptions 상품 정보 디버깅:', {
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      categoryStr,
      isShoeCategory,
      isPantsCategory,
      productColors: product.colors,
      productSizes: product.sizes,
      productTags: product.tags || [],
      availableColors: availableColors.map(c => c.label),
      availableSizes: availableSizes.map(s => s.label),
      availableShoeSizes: availableShoeSizes.map(s => s.label),
      availablePantsSizes: availablePantsSizes.map(s => s.label),
      finalColors: colors.map(c => c.label),
      finalSizes: sizes.map(s => s.label),
      sizeType: isShoeCategory ? 'shoe' : isPantsCategory ? 'pants' : 'clothing',
      noSizeCategories,
      shouldShow: !noSizeCategories.some(cat => categoryStr.includes(cat.toLowerCase())),
      willShowColorSelection: colors.length > 0
    });
    
    return !noSizeCategories.some(cat => 
      categoryStr.includes(cat.toLowerCase())
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
    <>
      {/* 색상 선택 - 색상이 지정된 상품만 표시 */}
      {colors.length > 0 && (
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
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`px-3 py-1.5 border-2 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 ${
                  selectedColor === color.value
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 사이즈 선택 */}
      {shouldShowSizeSelection() && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <span className="w-4 h-4 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
            {isShoeCategory && availableShoeSizes.length > 0 
              ? '신발 사이즈 선택' 
              : isPantsCategory && availablePantsSizes.length > 0 
              ? '바지 사이즈 선택 (inch)' 
              : '사이즈 선택'}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {/* 카테고리와 데이터에 따라 적절한 사이즈 목록 표시 */}
            {(isShoeCategory && availableShoeSizes.length > 0 
              ? availableShoeSizes 
              : isPantsCategory && availablePantsSizes.length > 0 
              ? availablePantsSizes 
              : sizes).map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                className={`px-3 py-1.5 border-2 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 ${
                  selectedSize === size.value
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                {size.label}
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
    </>
  );
}

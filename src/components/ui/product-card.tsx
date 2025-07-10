import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.log('이미지 로드 실패:', product.images[0]);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('이미지 로드 성공:', product.images[0]);
    setImageLoading(false);
    setImageError(false);
  };

  // 임시로 이미지 로딩 문제 해결을 위한 fallback
  const showFallback = !product.images[0] || imageError;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="card-hover aspect-square rounded-xl bg-muted relative overflow-hidden">
        {/* 상품 이미지 */}
        <div className="w-full h-full absolute transform transition-all duration-500 group-hover:scale-105">
          {!showFallback ? (
            <div className="relative w-full h-full">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
                priority={false}
                unoptimized={true}
              />
              {imageLoading && (
                <div className="w-full h-full flex items-center justify-center bg-muted absolute inset-0 z-10">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-slate-300 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500">이미지 준비중</p>
              </div>
            </div>
          )}
        </div>

        {/* 오버레이 및 액션 버튼 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
              <Eye size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
        
        {/* Out of Stock 표시 */}
        {!product.inStock && (
          <div className="absolute top-0 right-0 bg-black/70 backdrop-blur-sm text-white px-3 py-1 m-3 text-xs rounded-full">
            품절
          </div>
        )}
        
        {/* 신상품 또는 추천 상품 태그 */}
        {product.isFeatured && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 m-3 text-xs rounded-full">
            추천
          </div>
        )}
      </div>
      
      {/* 상품 정보 */}
      <div className="mt-4 px-1">
        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-foreground font-semibold mt-1">{product.price.toLocaleString()}원</p>
        
        {/* 컬러 옵션 표시 */}
        {product.colors.length > 0 && (
          <div className="flex mt-2 space-x-1">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border shadow-sm"
                style={{ 
                  backgroundColor: color.toLowerCase(),
                  boxShadow: color.toLowerCase() === '#ffffff' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                }}
                title={color}
              />
            ))}
          </div>
        )}

        {/* 사이즈 표시 */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.length > 3 ? (
              <span className="text-xs text-muted-foreground">{product.sizes.length}개 사이즈</span>
            ) : (
              product.sizes.map((size, index) => (
                <span key={index} className="text-xs px-1 border border-border rounded bg-muted">{size}</span>
              ))
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

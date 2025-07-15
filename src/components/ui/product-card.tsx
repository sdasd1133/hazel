import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Eye, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // 이미지가 있는지 확인
  const hasValidImage = product.images && product.images[0] && product.images[0].trim() !== '';

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="card-hover aspect-[4/5] rounded-xl bg-slate-100 relative overflow-hidden max-w-sm">
        {/* 상품 이미지 */}
        <div className="w-full h-[75%] relative">
          {hasValidImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
              unoptimized={true}
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <div className="text-center p-3">
                <div className="w-12 h-12 mx-auto mb-2 bg-slate-300 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-xs font-medium text-slate-700 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-slate-500">이미지 없음</p>
              </div>
            </div>
          )}
        </div>

        {/* 오버레이 및 액션 버튼 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
              <Eye size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
        
        {/* Out of Stock 표시 */}
        {!product.inStock && (
          <div className="absolute top-0 right-0 bg-black/70 backdrop-blur-sm text-white px-2 py-1 m-2 text-xs rounded-full">
            품절
          </div>
        )}
        
        {/* 신상품 또는 추천 상품 태그 */}
        {product.isFeatured && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 m-2 text-xs rounded-full">
            추천
          </div>
        )}
      </div>
      
      {/* 상품 정보 */}
      <div className="mt-3 px-1">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
        <p className="text-foreground font-semibold mt-2 text-base">{product.price.toLocaleString()}원</p>
        
        {/* 컬러 옵션 표시 */}
        {product.colors.length > 0 && (
          <div className="flex mt-2 space-x-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-border shadow-sm"
                style={{ 
                  backgroundColor: color.toLowerCase(),
                  boxShadow: color.toLowerCase() === '#ffffff' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* 사이즈 표시 */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.length > 3 ? (
              <span className="text-xs text-muted-foreground">{product.sizes.length}개 사이즈</span>
            ) : (
              product.sizes.slice(0, 3).map((size, index) => (
                <span key={index} className="text-xs px-1 py-0.5 border border-border rounded bg-muted">{size}</span>
              ))
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

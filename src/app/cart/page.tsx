"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Minus,
  Plus,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthCheck from "@/components/auth-check";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // 결제 페이지로 이동
    setTimeout(() => {
      router.push('/checkout');
    }, 500); // 짧은 로딩 애니메이션 후 이동
  };

  const renderCartContent = () => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            장바구니에 상품을 담고 쇼핑을 계속해보세요. 다양한 상품들이 여러분을
            기다리고 있습니다.
          </p>
          <Link href="/products">
            <Button variant="gradient" rounded className="group">
              <ShoppingCart size={16} className="mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 상품 목록 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm divide-y">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex p-4 md:p-6"
              >
                {/* 상품 이미지 */}
                <div className="w-20 h-20 md:w-28 md:h-28 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-xs text-muted-foreground">
                        이미지 없음
                      </span>
                    </div>
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="ml-4 md:ml-6 flex-grow">
                  <div className="flex justify-between">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      aria-label="상품 삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.selectedSize && (
                      <span className="mr-3">사이즈: {item.selectedSize}</span>
                    )}
                    {item.selectedColor && (
                      <span className="flex items-center">
                        컬러:
                        <span
                          className="inline-block w-3 h-3 ml-1 rounded-full border border-border"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(item, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:border-primary transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="mx-3 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:border-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-semibold">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <ArrowLeft size={16} className="mr-2" />
              쇼핑 계속하기
            </Link>
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">주문 요약</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 금액</span>
                <span>{getTotalPrice().toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span>
                  {getTotalPrice() >= 50000 ? "무료" : "3,000원"}
                </span>
              </div>
              {getTotalPrice() < 50000 && (
                <div className="text-xs text-primary">
                  * 5만원 이상 구매 시 무료배송
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>총 결제 금액</span>
                <span>
                  {(
                    getTotalPrice() +
                    (getTotalPrice() >= 50000 ? 0 : 3000)
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </div>

            <Button
              variant="gradient"
              className="w-full"
              rounded
              disabled={isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? (
                <>
                  <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  결제 진행 중...
                </>
              ) : (
                <>
                  <CreditCard size={16} className="mr-2" />
                  결제하기
                </>
              )}
            </Button>

            <div className="mt-6 bg-muted rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">안내사항</p>
              <ul className="space-y-1 list-disc pl-5 text-xs">
                <li>주문 후 2-3일 내에 발송됩니다.</li>
                <li>일부 상품은 품절될 수 있습니다.</li>
                <li>
                  결제 완료 후 주문 취소는 고객센터로 문의해주세요.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">장바구니</h1>
        {renderCartContent()}
      </div>
    </AuthCheck>
  );
}

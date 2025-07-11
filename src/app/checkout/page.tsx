"use client";

import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const dummyCartItems: CartItem[] = [
  { id: '1', name: '클래식 화이트 셔츠', price: 45000, quantity: 1 },
  { id: '2', name: '데님 자켓', price: 89000, quantity: 1 }
];

export default function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>(dummyCartItems);
  const [agreed, setAgreed] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleOrder = () => {
    if (!agreed) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    alert(`주문이 접수되었습니다!\n\n총 금액: ${total.toLocaleString()}원\n\n무통장 입금 계좌:\n국민은행 123-456-789012\n예금주: (주)헤이즐`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">주문/결제</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">주문 상품</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-3 border-b">
              <span>{item.name}</span>
              <span>{(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg">
            <span>총 금액</span>
            <span>{total.toLocaleString()}원</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">결제 방법</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <input type="radio" checked disabled className="mr-3" />
              <span className="font-medium text-blue-800">🏦 무통장 입금</span>
            </div>
            <div className="mt-3 ml-6 text-sm text-blue-600">
              <p>계좌: 국민은행 123-456-789012 (주)헤이즐</p>
              <p>입금 확인 후 상품을 발송합니다.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)} 
              className="mr-3" 
            />
            <span>[필수] 구매조건 및 개인정보처리 방침에 동의</span>
          </label>
        </div>

        <button
          onClick={handleOrder}
          disabled={!agreed}
          className={`w-full py-4 px-6 rounded-lg font-medium transition-colors ${
            agreed
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🏦 {total.toLocaleString()}원 주문하기 (무통장 입금)
        </button>
      </div>
    </div>
  );
}
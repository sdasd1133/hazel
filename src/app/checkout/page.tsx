"use client";

import { useState } from 'react';
import AuthCheck from '@/components/auth-check';
import { useAuthStore } from '@/lib/supabase-auth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

// 더미 장바구니 데이터
const dummyCartItems: CartItem[] = [
  {
    id: '1',
    name: '클래식 화이트 셔츠',
    price: 45000,
    quantity: 1,
    image: '/images/shirt-white.jpg',
    size: 'M',
    color: '화이트'
  },
  {
    id: '2',
    name: '데님 자켓',
    price: 89000,
    quantity: 1,
    image: '/images/jacket-denim.jpg',
    size: 'L',
    color: '인디고'
  }
];

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const [cartItems] = useState<CartItem[]>(dummyCartItems);
  
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    addressDetail: '',
    zipCode: '',
    deliveryRequest: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreementChecks, setAgreementChecks] = useState({
    purchase: false,
    privacy: false,
    thirdParty: false
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgreementChange = (key: keyof typeof agreementChecks) => {
    setAgreementChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allAgreed = Object.values(agreementChecks).every(Boolean);

  const handlePayment = () => {
    if (!allAgreed) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    // 결제 처리 로직
    alert('결제가 완료되었습니다!');
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">주문/결제</h1>
            <p className="text-gray-600 mt-2">주문 정보를 확인하고 결제를 진행해주세요.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 주문 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 주문 상품 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">주문 상품</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">👕</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="text-sm text-gray-500 space-x-2">
                          {item.size && <span>사이즈: {item.size}</span>}
                          {item.color && <span>색상: {item.color}</span>}
                        </div>
                        <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">배송 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      받는 분 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      우편번호
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                        검색
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      주소 *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세주소
                    </label>
                    <input
                      type="text"
                      name="addressDetail"
                      value={shippingInfo.addressDetail}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배송 요청사항
                    </label>
                    <textarea
                      name="deliveryRequest"
                      value={shippingInfo.deliveryRequest}
                      onChange={handleShippingChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="배송시 요청사항을 입력해주세요"
                    />
                  </div>
                </div>
              </div>

              {/* 결제 방법 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">결제 방법</h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>신용카드</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>계좌이체</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="virtual"
                      checked={paymentMethod === 'virtual'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>가상계좌</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="kakao"
                      checked={paymentMethod === 'kakao'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>카카오페이</span>
                  </label>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">약관 동의</h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreementChecks.purchase}
                      onChange={() => handleAgreementChange('purchase')}
                      className="mr-3"
                    />
                    <span>[필수] 구매조건 확인 및 결제진행에 동의</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreementChecks.privacy}
                      onChange={() => handleAgreementChange('privacy')}
                      className="mr-3"
                    />
                    <span>[필수] 개인정보 수집 및 이용에 동의</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreementChecks.thirdParty}
                      onChange={() => handleAgreementChange('thirdParty')}
                      className="mr-3"
                    />
                    <span>[필수] 개인정보 제3자 제공에 동의</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">주문 요약</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{subtotal.toLocaleString()}원</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">무료</span>
                      ) : (
                        `${shippingFee.toLocaleString()}원`
                      )}
                    </span>
                  </div>
                  
                  {shippingFee > 0 && (
                    <p className="text-sm text-gray-500">
                      {(50000 - subtotal).toLocaleString()}원 더 구매하면 무료배송
                    </p>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>총 결제금액</span>
                      <span className="text-indigo-600">{total.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePayment}
                    disabled={!allAgreed}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      allAgreed
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {total.toLocaleString()}원 결제하기
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    <p>결제 시 개인정보 및 결제정보는 암호화 처리되어 안전하게 보호됩니다.</p>
                  </div>
                </div>

                {/* 혜택 정보 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium mb-3">혜택 정보</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>🎁 첫 구매 시 5,000원 적립금 지급</p>
                    <p>📦 50,000원 이상 구매 시 무료배송</p>
                    <p>💳 카드 결제 시 추가 할인 혜택</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}

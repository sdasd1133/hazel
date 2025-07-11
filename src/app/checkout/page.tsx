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

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
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

    // 무통장 입금 주문 처리 로직
    const orderNumber = 'ORD' + Date.now();
    alert(`주문이 접수되었습니다!\n\n주문번호: ${orderNumber}\n\n입금 계좌 정보:\n• 은행: 국민은행\n• 계좌번호: 123-456-789012\n• 예금주: (주)헤이즐\n• 입금금액: ${total.toLocaleString()}원\n\n※ 입금자명을 "${shippingInfo.name}"으로 해주세요.\n※ 입금 확인 후 상품을 발송합니다.`);
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">주문/결제</h1>
            <p className="text-gray-600 mt-2">주문 정보를 확인하고 무통장 입금을 위한 주문접수를 진행해주세요.</p>
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                        disabled
                      />
                      <span className="font-medium text-blue-800">🏦 무통장 입금 (유일한 결제 방법)</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-3 ml-6 space-y-2">
                      <p>아래 계좌로 입금해주세요. 입금 확인 후 상품을 발송합니다.</p>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-medium">입금 계좌 정보</p>
                        <p>• 은행: 국민은행</p>
                        <p>• 계좌번호: 123-456-789012</p>
                        <p>• 예금주: (주)헤이즐</p>
                        <p className="text-red-600 mt-1">※ 입금자명은 주문자명과 동일하게 해주세요</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 비활성화된 다른 결제 방법들 */}
                  <div className="opacity-50">
                    <label className="flex items-center cursor-not-allowed">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        disabled
                        className="mr-3"
                      />
                      <span className="line-through">신용카드 (현재 사용 불가)</span>
                    </label>
                    
                    <label className="flex items-center cursor-not-allowed mt-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        disabled
                        className="mr-3"
                      />
                      <span className="line-through">실시간 계좌이체 (현재 사용 불가)</span>
                    </label>
                    
                    <label className="flex items-center cursor-not-allowed mt-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="virtual"
                        disabled
                        className="mr-3"
                      />
                      <span className="line-through">가상계좌 (현재 사용 불가)</span>
                    </label>
                    
                    <label className="flex items-center cursor-not-allowed mt-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="kakao"
                        disabled
                        className="mr-3"
                      />
                      <span className="line-through">카카오페이 (현재 사용 불가)</span>
                    </label>
                  </div>
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
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    🏦 {total.toLocaleString()}원 주문하기 (무통장 입금)
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    <p>주문 접수 후 계좌로 입금해주세요. 입금 확인 후 상품을 발송합니다.</p>
                    <p className="mt-1">입금계좌: 국민은행 123-456-789012 (주)헤이즐</p>
                  </div>
                </div>

                {/* 현금결제 안내 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium mb-3">💵 현금결제 안내</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>� 매장 방문 시 현금으로 결제</p>
                    <p>📦 주문 후 매장에서 상품 수령</p>
                    <p>🕐 운영시간: 10:00 - 22:00 (연중무휴)</p>
                    <p>� 서울시 강남구 테헤란로 123</p>
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

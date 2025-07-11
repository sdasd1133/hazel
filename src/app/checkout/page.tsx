"use client";

import { useState } from 'react';
import { CreditCard, Package, Shield, CheckCircle, Truck, Clock, Phone, MapPin, User, AlertCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

const dummyCartItems: CartItem[] = [
  { 
    id: '1', 
    name: '클래식 화이트 셔츠', 
    price: 45000, 
    quantity: 1,
    size: 'M',
    color: '화이트'
  },
  { 
    id: '2', 
    name: '데님 자켓', 
    price: 89000, 
    quantity: 1,
    size: 'L', 
    color: '인디고'
  }
];

export default function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>(dummyCartItems);
  const [agreed, setAgreed] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleOrder = () => {
    if (!agreed) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }
    
    const orderNumber = 'ORD' + Date.now();
    alert(`주문이 접수되었습니다!\n\n주문번호: ${orderNumber}\n총 금액: ${total.toLocaleString()}원\n\n무통장 입금 계좌:\n국민은행 123-456-789012\n예금주: (주)헤이즐\n\n입금자명: ${shippingInfo.name}로 입금해주세요.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            주문/결제
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            안전하고 편리한 무통장 입금으로 결제해보세요
          </p>
          
          {/* 진행 단계 표시 */}
          <div className="flex items-center justify-center mt-8 max-w-md mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span className="ml-2 text-sm font-medium text-indigo-600">장바구니</span>
              </div>
              <div className="w-8 h-px bg-indigo-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span className="ml-2 text-sm font-medium text-indigo-600">주문/결제</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span className="ml-2 text-sm font-medium text-gray-500">주문완료</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 왼쪽: 주문 정보 및 배송 정보 */}
          <div className="xl:col-span-2 space-y-8">
            {/* 주문 상품 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">주문 상품</h2>
                  <p className="text-sm text-gray-500 mt-1">{cartItems.length}개 상품</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`group hover:bg-gray-50 rounded-xl p-4 transition-colors duration-200 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-3xl">👕</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.size && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              사이즈: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              색상: {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">{(item.price * 1.2).toLocaleString()}원</p>
                        <p className="text-xl font-bold text-indigo-600">{(item.price * item.quantity).toLocaleString()}원</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">배송 정보</h2>
                  <p className="text-sm text-gray-500 mt-1">정확한 정보를 입력해주세요</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    받는 분 <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 group-hover:border-gray-300"
                      placeholder="받는 분 성함"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    연락처 <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 group-hover:border-gray-300"
                      placeholder="010-0000-0000"
                      required
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="md:col-span-2 group">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    배송 주소 <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 group-hover:border-gray-300"
                      placeholder="상세 주소까지 정확히 입력해주세요"
                      required
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* 배송 안내 */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">배송 안내</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 입금 확인 후 1-2일 내 발송 (주말 제외)</li>
                      <li>• 제주도/도서산간 지역은 추가 배송비가 발생할 수 있습니다</li>
                      <li>• 배송 완료 후 SMS로 알림을 보내드립니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 방법 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">결제 방법</h2>
                  <p className="text-sm text-gray-500 mt-1">안전한 무통장 입금</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-2xl font-bold text-blue-900 flex items-center">
                        🏦 무통장 입금
                      </span>
                    </div>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                      추천 결제
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center">
                        💳 입금 계좌 정보
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">복사 가능</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">은행</div>
                        <div className="font-bold text-blue-600">국민은행</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">계좌번호</div>
                        <div className="font-bold text-indigo-600">123-456-789012</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">예금주</div>
                        <div className="font-bold text-purple-600">(주)헤이즐</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-red-800 mb-1">입금 시 주의사항</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• 입금자명은 <strong>주문자명({shippingInfo.name || '입력된 이름'})</strong>과 동일하게 입금해주세요</li>
                            <li>• 주문 후 3일 이내 입금 완료해주세요</li>
                            <li>• 입금 확인 후 자동으로 발송 처리됩니다</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">약관 동의</h2>
                  <p className="text-sm text-gray-500 mt-1">주문 진행을 위한 필수 동의</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <label className="group flex items-start cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                  <div className="flex items-center h-6">
                    <input 
                      type="checkbox" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)} 
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2" 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                        [필수] 구매조건 및 개인정보처리 방침에 동의
                      </span>
                      <span className="ml-2 text-red-500 font-bold">*</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      주문 처리를 위해 개인정보 수집·이용 및 제3자 제공에 동의하며,<br />
                      구매조건 및 취소/환불 정책을 확인했습니다.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 underline">이용약관 보기</button>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 underline">개인정보처리방침 보기</button>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 underline">환불정책 보기</button>
                    </div>
                  </div>
                </label>
                
                {!agreed && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">주문 진행을 위해 필수 약관에 동의해주세요.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">주문 요약</h3>
                <p className="text-sm text-gray-500 mt-1">최종 결제 내역</p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">상품 금액</span>
                  <span className="text-lg font-bold text-gray-900">{subtotal.toLocaleString()}원</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">배송비</span>
                  <span className="text-lg font-bold">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 flex items-center">
                        <span className="mr-1">🚚</span> 무료
                      </span>
                    ) : (
                      `${shippingFee.toLocaleString()}원`
                    )}
                  </span>
                </div>
                
                {shippingFee > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                    <div className="flex items-center text-sm text-green-700">
                      <span className="mr-2">🎯</span>
                      <span className="font-medium">
                        {(50000 - subtotal).toLocaleString()}원 더 구매하면 무료배송!
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">총 결제금액</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {total.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        VAT 포함
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={!agreed || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address}
                className={`w-full py-5 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  agreed && shippingInfo.name && shippingInfo.phone && shippingInfo.address
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl border-2 border-transparent'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-200'
                }`}
              >
                {agreed && shippingInfo.name && shippingInfo.phone && shippingInfo.address ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🏦</span>
                    {total.toLocaleString()}원 주문하기
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    정보 입력 필요
                  </span>
                )}
              </button>
              
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  입금 확인 후 1-2일 내 발송
                </p>
                <p className="text-xs text-gray-400">영업일 기준 (주말/공휴일 제외)</p>
              </div>
              
              {/* 안전 결제 안내 */}
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  안전한 결제 보장
                </h4>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    SSL 보안 연결로 정보 보호
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    입금 확인 후 즉시 발송 처리
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    전 상품 품질보증 및 A/S
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                    24시간 고객센터 운영
                  </li>
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>🔒 256bit SSL</span>
                    <span>•</span>
                    <span>📞 고객센터</span>
                    <span>•</span>
                    <span>✅ 품질보증</span>
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
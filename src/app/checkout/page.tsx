"use client";

import { useState } from 'react';
import { ShoppingBag, CreditCard, MapPin, Search, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

interface ShippingInfo {
  name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  deliveryRequest: string;
  deliveryNote: string;
}

const dummyCartItems: CartItem[] = [
  { 
    id: '1', 
    name: '데님 자켓', 
    price: 89000, 
    quantity: 1,
    size: 'L', 
    color: '인디고'
  }
];

const deliveryOptions = [
  '배송 요청사항을 선택해주세요',
  '경비실에 맡겨주세요',
  '문 앞에 놓아주세요',
  '택배함에 넣어주세요',
  '부재 시 연락주세요',
  '직접 입력'
];

export default function CheckoutPage() {
  const { items: cartItems, getTotalPrice } = useCartStore();
  
  // 장바구니가 비어있으면 안내 메시지 표시
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-6">주문할 상품을 먼저 장바구니에 담아주세요.</p>
          <a href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            쇼핑 계속하기
          </a>
        </div>
      </div>
    );
  }

  const [agreed, setAgreed] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    zipcode: '',
    address1: '',
    address2: '',
    deliveryRequest: '',
    deliveryNote: ''
  });
  const [isAddressSearched, setIsAddressSearched] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const validateField = (name: keyof ShippingInfo, value: string) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : '받는 분 성함을 입력해주세요';
      case 'phone':
        const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
        return phoneRegex.test(value.replace(/-/g, '')) ? '' : '올바른 휴대폰 번호를 입력해주세요';
      case 'zipcode':
        return value.length === 5 ? '' : '우편번호 5자리를 입력해주세요';
      case 'address1':
        return value.trim() ? '' : '기본 주소를 입력해주세요';
      case 'address2':
        return value.trim() ? '' : '상세 주소를 입력해주세요';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // 휴대폰 번호 자동 형식 변환
    if (name === 'phone') {
      const numbers = value.replace(/[^0-9]/g, '');
      if (numbers.length <= 11) {
        if (numbers.length <= 3) {
          processedValue = numbers;
        } else if (numbers.length <= 7) {
          processedValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
          processedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
        }
      } else {
        return; // 11자리 초과 입력 방지
      }
    }
    
    setShippingInfo(prev => ({ ...prev, [name]: processedValue }));
    
    // 실시간 유효성 검사
    const error = validateField(name as keyof ShippingInfo, processedValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleAddressSearch = () => {
    // 실제 구현에서는 다음(Daum) 우편번호 API 등을 사용
    // 여기서는 시뮬레이션
    setShippingInfo(prev => ({
      ...prev,
      zipcode: '12345',
      address1: '서울특별시 강남구 테헤란로 123'
    }));
    setIsAddressSearched(true);
    setErrors(prev => ({ ...prev, zipcode: '', address1: '' }));
  };

  const validateAllFields = () => {
    const newErrors: Partial<ShippingInfo> = {};
    const requiredFields: (keyof ShippingInfo)[] = ['name', 'phone', 'address1', 'address2'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, shippingInfo[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async () => {
    if (!agreed) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    
    if (!validateAllFields()) {
      alert('배송 정보를 정확히 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 실제 주문 처리 로직 (추후 구현)
      const orderNumber = 'ORD' + Date.now();
      
      // 시뮬레이션: 주문 처리 시간
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`주문이 접수되었습니다!\n주문번호: ${orderNumber}\n총 금액: ${total.toLocaleString()}원`);
    } catch (error) {
      console.error('주문 처리 중 오류:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">주문/결제</h1>
          <p className="text-gray-600">주문 정보를 확인하고 결제를 진행해주세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 주문 상품 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                주문 상품
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 relative overflow-hidden">
                        {item.product.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-xs text-gray-500">이미지 없음</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.selectedSize && `사이즈: ${item.selectedSize}`} {item.selectedColor && `색상: ${item.selectedColor}`}
                        </p>
                        <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(item.product.price * item.quantity).toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                배송 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">정확한 배송을 위해 상세 정보를 입력해주세요</p>
              
              <div className="space-y-6">
                {/* 받는 분 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      받는 분 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="성함을 입력해주세요"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="010-1234-5678"
                      maxLength={13}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                {/* 주소 정보 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      우편번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="zipcode"
                        value={shippingInfo.zipcode}
                        onChange={handleInputChange}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.zipcode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } ${isAddressSearched ? 'bg-gray-50' : ''}`}
                        placeholder="우편번호"
                        maxLength={5}
                        readOnly={isAddressSearched}
                      />
                      <button
                        type="button"
                        onClick={handleAddressSearch}
                        className="px-6 py-3 bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
                      >
                        <Search className="h-4 w-4" />
                        주소찾기
                      </button>
                    </div>
                    {errors.zipcode && <p className="mt-1 text-xs text-red-600">{errors.zipcode}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      기본 주소 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address1"
                        value={shippingInfo.address1}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.address1 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } ${isAddressSearched ? 'bg-gray-50' : ''}`}
                        placeholder="주소찾기 버튼을 클릭해주세요"
                        readOnly={!isAddressSearched}
                      />
                      {isAddressSearched && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.address1 && <p className="mt-1 text-xs text-red-600">{errors.address1}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세 주소 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address2"
                      value={shippingInfo.address2}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.address2 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="동, 호수 등 상세 주소를 입력해주세요"
                    />
                    {errors.address2 && <p className="mt-1 text-xs text-red-600">{errors.address2}</p>}
                  </div>
                </div>

                {/* 배송 요청사항 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배송 요청사항 <span className="text-gray-400">(선택)</span>
                  </label>
                  <div className="space-y-3">
                    <select 
                      name="deliveryRequest"
                      value={shippingInfo.deliveryRequest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {deliveryOptions.map((option, index) => (
                        <option key={index} value={index === 0 ? '' : option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    
                    {(shippingInfo.deliveryRequest === '직접 입력' || (!shippingInfo.deliveryRequest && shippingInfo.deliveryNote)) && (
                      <textarea
                        name="deliveryNote"
                        value={shippingInfo.deliveryNote}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="추가 요청사항을 상세히 입력해주세요"
                        maxLength={200}
                      />
                    )}
                    
                    {shippingInfo.deliveryNote && (
                      <div className="text-xs text-gray-500 text-right">
                        {shippingInfo.deliveryNote.length}/200자
                      </div>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                결제 방법
              </h2>
              
              {/* 결제 방법 선택 */}
              <div className="space-y-3 mb-6">
                <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">무통장 입금</h3>
                      <p className="text-sm text-blue-700 mt-1">안전하고 간편한 계좌이체</p>
                    </div>
                    <div className="w-4 h-4 border-2 border-blue-600 rounded-full bg-blue-600"></div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-500">카드 결제</h3>
                      <p className="text-sm text-gray-400 mt-1">준비 중입니다</p>
                    </div>
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* 계좌 정보 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">입금 계좌 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">은행명</span>
                    <span className="font-medium">국민은행</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">계좌번호</span>
                    <span className="font-medium">123-456-789012</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">예금주</span>
                    <span className="font-medium">HAZEL</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  💡 입금자명을 주문자명과 동일하게 입력해주세요
                </div>
              </div>

              {/* 주문 요약 */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">주문 요약</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품금액</span>
                    <span className="font-medium">{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">무료</span>
                      ) : (
                        `${shippingFee.toLocaleString()}원`
                      )}
                    </span>
                  </div>
                  {subtotal < 50000 && (
                    <div className="text-xs text-gray-500 pl-4">
                      5만원 이상 구매 시 무료배송
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>총 결제금액</span>
                    <span className="text-blue-600">{total.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start space-x-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-gray-700">
                    <span className="font-medium">주문 내용을 확인했으며</span>, 개인정보 처리방침 및 이용약관에 동의합니다
                  </span>
                </label>
              </div>

              {/* 주문 버튼 */}
              <button
                onClick={handleOrder}
                disabled={!agreed || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address1 || !shippingInfo.address2 || isLoading}
                className={`w-full mt-6 py-4 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  !agreed || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address1 || !shippingInfo.address2 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    주문 처리 중...
                  </div>
                ) : (
                  `💳 ${total.toLocaleString()}원 주문하기`
                )}
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                주문 완료 후 변경/취소는 고객센터로 문의해주세요
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
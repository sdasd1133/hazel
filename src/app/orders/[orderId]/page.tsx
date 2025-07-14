"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, Home, ArrowLeft, Calendar, CreditCard, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingInfo: {
    name: string;
    phone: string;
    zipcode: string;
    address1: string;
    address2: string;
    deliveryRequest: string;
  };
  totalAmount: number;
  shippingFee: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 API에서 주문 정보를 가져와야 합니다
    // 여기서는 로컬 스토리지에서 주문 정보를 가져옵니다
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // 로컬 스토리지에서 주문 정보 확인
        const savedOrder = localStorage.getItem(`order_${orderId}`);
        
        if (savedOrder) {
          const orderData = JSON.parse(savedOrder);
          setOrder(orderData);
        } else {
          // 예시 주문 데이터 (실제로는 API 호출)
          const mockOrder: Order = {
            id: orderId,
            status: 'confirmed',
            items: [
              {
                id: '1',
                product: {
                  id: '1',
                  name: '다니엘이 신던 양말',
                  price: 1590000,
                  images: ['/placeholder-product.jpg']
                },
                quantity: 2,
                selectedSize: 'XL',
                selectedColor: '흰색'
              }
            ],
            shippingInfo: {
              name: '홍길동',
              phone: '010-1234-5678',
              zipcode: '12345',
              address1: '서울시 강남구 테헤란로 123',
              address2: '456호',
              deliveryRequest: '문 앞에 놓아주세요'
            },
            totalAmount: 3180000,
            shippingFee: 0,
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            trackingNumber: '1234567890'
          };
          setOrder(mockOrder);
        }

        // 실제 구현에서는 아래와 같이 API 호출
        // const response = await fetch(`/api/orders/${orderId}`);
        // const order = await response.json();
        
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('주문 정보 로딩 실패:', error);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { text: '주문 접수', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'confirmed':
        return { text: '주문 확인', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'shipped':
        return { text: '배송 중', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      case 'delivered':
        return { text: '배송 완료', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'cancelled':
        return { text: '주문 취소', color: 'text-red-600', bgColor: 'bg-red-100' };
      default:
        return { text: '알 수 없음', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const getOrderProgress = (status: Order['status']) => {
    const steps = [
      { key: 'pending', label: '주문 접수', icon: CheckCircle },
      { key: 'confirmed', label: '주문 확인', icon: Package },
      { key: 'shipped', label: '배송 중', icon: Truck },
      { key: 'delivered', label: '배송 완료', icon: Home }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">주문 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">주문을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">요청하신 주문 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/orders')} variant="outline">
            주문 목록으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const orderProgress = getOrderProgress(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold">주문 상세</h1>
            <p className="text-gray-600">주문번호: {order.id}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.color} font-medium`}>
          {statusInfo.text}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 컬럼 - 주문 진행 상황 및 배송 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문 진행 상황 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-6">주문 진행 상황</h2>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {orderProgress.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.key} className="relative flex items-start">
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                        step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {step.current && (
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 배송 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              배송 정보
            </h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-20 text-gray-600">받는 분:</span>
                <span className="font-medium">{order.shippingInfo.name}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-600">연락처:</span>
                <span>{order.shippingInfo.phone}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-600">주소:</span>
                <div>
                  <div>({order.shippingInfo.zipcode}) {order.shippingInfo.address1}</div>
                  <div className="text-gray-600">{order.shippingInfo.address2}</div>
                </div>
              </div>
              {order.shippingInfo.deliveryRequest && (
                <div className="flex">
                  <span className="w-20 text-gray-600">배송 요청:</span>
                  <span className="text-gray-600">{order.shippingInfo.deliveryRequest}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex">
                  <span className="w-20 text-gray-600">운송장:</span>
                  <span className="text-blue-600 font-medium">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* 주문 상품 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              주문 상품
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} 
                     className="flex items-center p-4 border rounded-lg">
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
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.selectedSize && `사이즈: ${item.selectedSize}`} 
                      {item.selectedColor && ` · 색상: ${item.selectedColor}`}
                    </p>
                    <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{(item.product.price * item.quantity).toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 주문 요약 */}
        <div className="space-y-6">
          {/* 주문 정보 요약 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              주문 정보
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문일시</span>
                <span>{new Date(order.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              {order.estimatedDelivery && (
                <div className="flex justify-between">
                  <span className="text-gray-600">예상 배송일</span>
                  <span>{new Date(order.estimatedDelivery).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              결제 정보
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">상품금액</span>
                <span>{(order.totalAmount - order.shippingFee).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">배송비</span>
                <span>{order.shippingFee === 0 ? '무료' : `${order.shippingFee.toLocaleString()}원`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>총 결제금액</span>
                <span className="text-blue-600">{order.totalAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            {order.status === 'shipped' && order.trackingNumber && (
              <Button className="w-full" variant="outline">
                배송 조회
              </Button>
            )}
            {order.status === 'delivered' && (
              <Button className="w-full" variant="outline">
                리뷰 작성
              </Button>
            )}
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <Button className="w-full" variant="outline">
                주문 취소
              </Button>
            )}
            <Button 
              className="w-full" 
              variant="ghost"
              onClick={() => router.push('/orders')}
            >
              주문 목록 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, CreditCard, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSummary {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  firstProductName: string;
  firstProductImage?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // 로컬 스토리지에서 주문 목록 가져오기
        const allOrders: OrderSummary[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('order_')) {
            try {
              const orderData = JSON.parse(localStorage.getItem(key) || '{}');
              if (orderData.id && orderData.items && orderData.items.length > 0) {
                const firstItem = orderData.items[0];
                allOrders.push({
                  id: orderData.id,
                  status: orderData.status || 'confirmed',
                  totalAmount: orderData.totalAmount || 0,
                  itemCount: orderData.items.length,
                  createdAt: orderData.createdAt || new Date().toISOString(),
                  firstProductName: firstItem.product?.name || '상품명 없음',
                  firstProductImage: firstItem.product?.images?.[0] || '/placeholder-product.jpg'
                });
              }
            } catch (error) {
              console.error('주문 데이터 파싱 오류:', error);
            }
          }
        }
        
        // 최신 주문순으로 정렬
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // 예시 주문 데이터 (로컬 스토리지에 주문이 없을 때)
        if (allOrders.length === 0) {
          const mockOrders: OrderSummary[] = [
            {
              id: 'ORD1736803200000',
              status: 'confirmed',
              totalAmount: 3180000,
              itemCount: 2,
              createdAt: new Date().toISOString(),
              firstProductName: '다니엘이 신던 양말',
              firstProductImage: '/placeholder-product.jpg'
            },
            {
              id: 'ORD1736716800000',
              status: 'shipped',
              totalAmount: 159000,
              itemCount: 1,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              firstProductName: '데님 자켓',
              firstProductImage: '/placeholder-product.jpg'
            }
          ];
          allOrders.push(...mockOrders);
        }

        // 실제 구현에서는 아래와 같이 API 호출
        // const response = await fetch('/api/orders');
        // const orders = await response.json();
        
        setTimeout(() => {
          setOrders(allOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('주문 목록 로딩 실패:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusInfo = (status: OrderSummary['status']) => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">주문 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">주문 내역</h1>
          <p className="text-gray-600 mt-1">지금까지의 주문 내역을 확인하세요</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 주문 목록 */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">주문 내역이 없습니다</h2>
          <p className="text-gray-600 mb-6">아직 주문하신 상품이 없습니다. 쇼핑을 시작해보세요!</p>
          <Button onClick={() => router.push('/products')}>
            상품 둘러보기
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            
            return (
              <div 
                key={order.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className="p-6">
                  {/* 주문 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-lg">주문번호: {order.id}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* 주문 내용 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg relative overflow-hidden">
                        {order.firstProductImage ? (
                          <img 
                            src={order.firstProductImage} 
                            alt={order.firstProductName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{order.firstProductName}</p>
                        {order.itemCount > 1 && (
                          <p className="text-sm text-gray-500">
                            외 {order.itemCount - 1}개 상품
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center text-gray-600 mb-1">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <span className="text-sm">총 결제금액</span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {order.totalAmount.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 하단 안내 */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">주문 관련 안내</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 주문 취소는 상품 발송 전까지만 가능합니다.</li>
          <li>• 배송 후 교환/반품은 7일 이내에 신청해주세요.</li>
          <li>• 주문 관련 문의는 고객센터(1588-0000)로 연락주세요.</li>
        </ul>
      </div>
    </div>
  );
}

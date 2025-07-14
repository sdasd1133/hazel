"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

const statusLabels = {
  pending: '결제대기',
  processing: '상품준비중',
  shipped: '배송중',
  delivered: '배송완료',
  cancelled: '주문취소'
};

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-50',
  processing: 'text-blue-600 bg-blue-50',
  shipped: 'text-purple-600 bg-purple-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50'
};

// 더미 데이터
const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'GL20250110001',
    date: '2025-01-10',
    status: 'delivered',
    total: 89000,
    items: [
      {
        id: '1',
        name: '클래식 화이트 셔츠',
        image: '/images/shirt-white.jpg',
        price: 45000,
        quantity: 1
      },
      {
        id: '2',
        name: '데님 자켓',
        image: '/images/jacket-denim.jpg',
        price: 44000,
        quantity: 1
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'GL20250108001',
    date: '2025-01-08',
    status: 'shipped',
    total: 156000,
    items: [
      {
        id: '3',
        name: '울 코트',
        image: '/images/coat-wool.jpg',
        price: 156000,
        quantity: 1
      }
    ]
  }
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(dummyOrders);
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">주문내역</h1>
          <p className="text-gray-600 mt-2">주문하신 상품의 주문내역을 확인하실 수 있습니다.</p>
        </div>

          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {Object.entries(statusLabels).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 주문 목록 */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* 주문 헤더 */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-600">주문번호</p>
                          <p className="font-medium">{order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">주문일자</p>
                          <p className="font-medium">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">총 금액</p>
                          <p className="font-medium">{order.total.toLocaleString()}원</p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 주문 상품 목록 */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">📦</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.price.toLocaleString()}원 × {item.quantity}개
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                          주문상세
                        </button>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            리뷰작성
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            주문취소
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">주문내역이 없습니다</h3>
                <p className="text-gray-500 mb-6">
                  {filter === 'all' 
                    ? '아직 주문하신 상품이 없습니다.' 
                    : `${statusLabels[filter as keyof typeof statusLabels]} 상태의 주문이 없습니다.`
                  }
                </p>
                <Link 
                  href="/products"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                >
                  쇼핑하러 가기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

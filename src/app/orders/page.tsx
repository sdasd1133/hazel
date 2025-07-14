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

export default function OrdersPage() {
  const [orders] = useState<Order[]>([]);
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
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">주문 내역이 없습니다.</p>
              <Link 
                href="/products"
                className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                쇼핑하러 가기
              </Link>
            </div>
          ) : (
            <div>주문 목록이 여기에 표시됩니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, Heart, Settings, ShoppingBag, CreditCard, MapPin, Bell, LogOut, Edit3 } from 'lucide-react';
import { useAuthStore } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!user) {
      router.push('/login?redirect=/mypage');
      return;
    }

    // 주문 내역 로드 (로컬 스토리지에서)
    loadOrders();
  }, [user, router]);

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('주문 내역 로드 오류:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '주문 접수';
      case 'processing': return '상품 준비중';
      case 'shipped': return '배송중';
      case 'delivered': return '배송 완료';
      case 'cancelled': return '주문 취소';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}님</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>대시보드</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    <span>주문 내역</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'wishlist' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    <span>찜한 상품</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>프로필 설정</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 퀵 액션 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      href="/orders"
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">주문 내역</h3>
                          <p className="text-sm text-gray-600">{orders.length}개 주문</p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/wishlist"
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <Heart className="h-8 w-8 text-red-500" />
                        <div>
                          <h3 className="font-semibold">찜한 상품</h3>
                          <p className="text-sm text-gray-600">0개 상품</p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/cart"
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <ShoppingBag className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold">장바구니</h3>
                          <p className="text-sm text-gray-600">바로 가기</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* 최근 주문 */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">최근 주문</h2>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">주문 #{order.id.slice(0, 8)}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{order.date}</p>
                            <p className="font-semibold">{order.total.toLocaleString()}원</p>
                          </div>
                        ))}
                        <Link
                          href="/orders"
                          className="block text-center text-blue-600 hover:text-blue-700 mt-4"
                        >
                          모든 주문 보기
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">아직 주문 내역이 없습니다.</p>
                        <Link
                          href="/products"
                          className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          쇼핑하러 가기
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">주문 내역</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium">주문 #{order.id.slice(0, 8)}</h3>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                                </div>
                                <p className="font-semibold">{(item.price * item.quantity).toLocaleString()}원</p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-4 flex justify-between items-center">
                            <span className="font-semibold">총 결제금액: {order.total.toLocaleString()}원</span>
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              상세 보기
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">주문 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">찜한 상품</h2>
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">찜한 상품이 없습니다.</p>
                    <Link
                      href="/products"
                      className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      상품 둘러보기
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">프로필 설정</h2>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">휴대폰 번호</label>
                      <input
                        type="tel"
                        placeholder="휴대폰 번호를 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="우편번호"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            주소 검색
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="기본 주소"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="상세 주소"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        저장하기
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

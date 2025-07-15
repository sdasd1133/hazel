'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface PopularProduct {
  id: number;
  name: string;
  price: number;
  images: string[];
  sales_count?: number;
}

const Card = ({ title, value, icon, color }: { title: string; value: string; icon: JSX.Element; color: string }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '주문접수' },
    paid: { bg: 'bg-blue-100', text: 'text-blue-800', label: '결제완료' },
    processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: '처리중' },
    shipped: { bg: 'bg-orange-100', text: 'text-orange-800', label: '배송중' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', label: '배송완료' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: '주문취소' },
  };
  
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  return (
    <span className={`${config.bg} ${config.text} px-2 py-1 rounded text-xs`}>
      {config.label}
    </span>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const refreshData = () => {
    setLastRefresh(Date.now());
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        console.log('대시보드 데이터 로딩 시작');
        
        // 1. 상품 통계
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id');
        
        if (productsError) {
          console.error('상품 데이터 로드 오류:', productsError);
        }

        // 2. 로컬스토리지에서 주문 데이터 가져오기
        const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        console.log('로컬스토리지 주문 데이터:', userOrders);

        // 3. 주문 통계 계산
        const totalRevenue = userOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        
        // 4. 최근 주문 데이터 변환
        const recentOrdersData: RecentOrder[] = userOrders.slice(0, 5).map((order: any, index: number) => ({
          id: order.id || `order-${index}`,
          orderNumber: order.id || `ORDER-${Date.now()}-${index}`,
          customerName: order.shippingInfo?.name || '고객',
          totalAmount: order.totalAmount || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || new Date().toISOString()
        }));

        // 5. 인기 상품 데이터 (DB에서 가져오기)
        const { data: popularProductsData, error: popularProductsError } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3);

        if (popularProductsError) {
          console.error('인기 상품 데이터 로드 오류:', popularProductsError);
        }

        // 상태 업데이트
        setStats({
          products: productsData?.length || 0,
          orders: userOrders.length,
          users: 342, // 실제 사용자 데이터가 없으므로 임시값
          revenue: totalRevenue
        });

        setRecentOrders(recentOrdersData);
        setPopularProducts(popularProductsData || []);

        console.log('대시보드 데이터 로딩 완료:', {
          products: productsData?.length || 0,
          orders: userOrders.length,
          revenue: totalRevenue,
          recentOrders: recentOrdersData.length,
          popularProducts: popularProductsData?.length || 0
        });

      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [lastRefresh]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '로딩 중...' : '새로고침'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="총 상품 수" 
          value={`${stats.products}개`} 
          icon={<Package className="h-6 w-6 text-blue-500" />} 
          color="bg-blue-100" 
        />
        <Card 
          title="총 주문 수" 
          value={`${stats.orders}건`} 
          icon={<ShoppingCart className="h-6 w-6 text-green-500" />} 
          color="bg-green-100" 
        />
        <Card 
          title="총 사용자 수" 
          value={`${stats.users}명`} 
          icon={<Users className="h-6 w-6 text-purple-500" />} 
          color="bg-purple-100" 
        />
        <Card 
          title="총 매출" 
          value={`${stats.revenue.toLocaleString()}원`} 
          icon={<TrendingUp className="h-6 w-6 text-orange-500" />} 
          color="bg-orange-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">최근 주문</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">주문번호</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">고객</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">금액</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">상태</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-sm">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm">₩{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      {isLoading ? '로딩 중...' : '주문 데이터가 없습니다'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">인기 상품</h3>
          <div className="space-y-4">
            {popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                      ₩{product.price.toLocaleString()} | 최신 등록
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                {isLoading ? '로딩 중...' : '상품 데이터가 없습니다'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

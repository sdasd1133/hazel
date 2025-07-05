'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    // 실제 구현에서는 API 호출을 통해 통계를 가져옵니다.
    // 현재는 예시 데이터를 사용합니다.
    const fetchStats = async () => {
      // 가상의 API 호출 시뮬레이션
      setTimeout(() => {
        setStats({
          products: 125,
          orders: 84,
          users: 342,
          revenue: 18650000
        });
      }, 500);
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
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
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">#ORDER-12345</td>
                  <td className="py-3 px-4 text-sm">홍길동</td>
                  <td className="py-3 px-4 text-sm">₩152,000</td>
                  <td className="py-3 px-4 text-sm"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">배송완료</span></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">#ORDER-12344</td>
                  <td className="py-3 px-4 text-sm">김철수</td>
                  <td className="py-3 px-4 text-sm">₩89,000</td>
                  <td className="py-3 px-4 text-sm"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">배송중</span></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">#ORDER-12343</td>
                  <td className="py-3 px-4 text-sm">이영희</td>
                  <td className="py-3 px-4 text-sm">₩237,500</td>
                  <td className="py-3 px-4 text-sm"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">결제완료</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">인기 상품</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">오버사이즈 캐시미어 니트</h4>
                <p className="text-sm text-gray-500">₩89,000 | 판매: 32개</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">와이드핏 데님 팬츠</h4>
                <p className="text-sm text-gray-500">₩78,000 | 판매: 28개</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">울 블렌드 코트</h4>
                <p className="text-sm text-gray-500">₩239,000 | 판매: 21개</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

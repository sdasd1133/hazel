'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '주문접수', icon: Clock },
    paid: { bg: 'bg-blue-100', text: 'text-blue-800', label: '결제완료', icon: CreditCard },
    processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: '처리중', icon: Package },
    shipped: { bg: 'bg-orange-100', text: 'text-orange-800', label: '배송중', icon: Truck },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', label: '배송완료', icon: CheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: '주문취소', icon: XCircle },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: '환불완료', icon: XCircle }
  };
  
  const config = statusConfig[status];
  const IconComponent = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <IconComponent className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const PaymentStatusBadge = ({ status }: { status: Order['paymentStatus'] }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '대기중' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: '결제완료' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: '결제실패' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: '환불완료' }
  };
  
  const config = statusConfig[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const OrderModal = ({ order, isOpen, onClose, onStatusUpdate }: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: Order['status']) => void;
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">주문 상세 정보</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 주문 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">주문 정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">주문일:</span>
                  <span>{new Date(order.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">주문상태:</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제상태:</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">고객 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{order.customerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 배송지 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              배송지 정보
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div><strong>받는 사람:</strong> {order.shippingAddress.name}</div>
                <div><strong>연락처:</strong> {order.shippingAddress.phone}</div>
                <div><strong>주소:</strong> {order.shippingAddress.address}</div>
                <div><strong>우편번호:</strong> {order.shippingAddress.zipCode}</div>
              </div>
            </div>
          </div>

          {/* 주문 상품 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">주문 상품</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    <p className="text-sm text-gray-500">
                      {item.size && `사이즈: ${item.size}`} {item.color && `색상: ${item.color}`}
                    </p>
                    <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{(item.price * item.quantity).toLocaleString()}원</div>
                    <div className="text-sm text-gray-500">단가: {item.price.toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">결제 정보</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>상품 금액:</span>
                <span>{order.subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비:</span>
                <span>{order.shippingCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>세금:</span>
                <span>{order.tax.toLocaleString()}원</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>총 결제 금액:</span>
                <span>{order.total.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 상태 변경 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">상태 변경</h3>
            <div className="flex gap-2 flex-wrap">
              {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusUpdate(order.id, status as Order['status'])}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    order.status === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {status === 'pending' && '주문접수'}
                  {status === 'paid' && '결제완료'}
                  {status === 'processing' && '처리중'}
                  {status === 'shipped' && '배송중'}
                  {status === 'delivered' && '배송완료'}
                  {status === 'cancelled' && '주문취소'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [filterPayment, setFilterPayment] = useState<'all' | Order['paymentStatus']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 실제 구현에서는 API에서 주문 데이터를 가져옵니다
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // 가상의 주문 데이터
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORDER-2024-001',
          customerId: '1',
          customerName: '홍길동',
          customerEmail: 'hong@example.com',
          customerPhone: '010-1234-5678',
          status: 'processing',
          paymentMethod: 'credit_card',
          paymentStatus: 'paid',
          shippingAddress: {
            name: '홍길동',
            phone: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123',
            city: '서울',
            zipCode: '06234'
          },
          items: [
            {
              id: '1',
              productName: '오버사이즈 니트',
              productImage: '/placeholder-product.jpg',
              size: 'L',
              color: '베이지',
              quantity: 1,
              price: 89000
            },
            {
              id: '2',
              productName: '와이드 팬츠',
              productImage: '/placeholder-product.jpg',
              size: 'M',
              color: '블랙',
              quantity: 2,
              price: 65000
            }
          ],
          subtotal: 219000,
          shippingCost: 3000,
          tax: 22200,
          total: 244200,
          createdAt: '2024-07-13T10:30:00Z',
          updatedAt: '2024-07-13T14:15:00Z'
        },
        {
          id: '2',
          orderNumber: 'ORDER-2024-002',
          customerId: '2',
          customerName: '김영희',
          customerEmail: 'kim@example.com',
          customerPhone: '010-9876-5432',
          status: 'shipped',
          paymentMethod: 'bank_transfer',
          paymentStatus: 'paid',
          shippingAddress: {
            name: '김영희',
            phone: '010-9876-5432',
            address: '부산시 해운대구 센텀로 456',
            city: '부산',
            zipCode: '48058'
          },
          items: [
            {
              id: '3',
              productName: '코튼 티셔츠',
              productImage: '/placeholder-product.jpg',
              size: 'S',
              color: '화이트',
              quantity: 3,
              price: 39000
            }
          ],
          subtotal: 117000,
          shippingCost: 3000,
          tax: 12000,
          total: 132000,
          createdAt: '2024-07-12T15:20:00Z',
          updatedAt: '2024-07-13T09:45:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORDER-2024-003',
          customerId: '3',
          customerName: '이철수',
          customerEmail: 'lee@example.com',
          customerPhone: '010-5555-1234',
          status: 'pending',
          paymentMethod: 'credit_card',
          paymentStatus: 'pending',
          shippingAddress: {
            name: '이철수',
            phone: '010-5555-1234',
            address: '대구시 수성구 범어로 789',
            city: '대구',
            zipCode: '42195'
          },
          items: [
            {
              id: '4',
              productName: '데님 재킷',
              productImage: '/placeholder-product.jpg',
              size: 'XL',
              color: '인디고',
              quantity: 1,
              price: 159000
            }
          ],
          subtotal: 159000,
          shippingCost: 3000,
          tax: 16200,
          total: 178200,
          createdAt: '2024-07-13T16:45:00Z',
          updatedAt: '2024-07-13T16:45:00Z'
        }
      ];
      
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 500);
    };

    fetchOrders();
  }, []);

  // 필터링된 주문 목록
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Download className="h-4 w-4" />
            엑셀 다운로드
          </button>
          <span className="text-sm text-gray-500">총 {orders.length}건</span>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="주문번호, 고객명, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 주문 상태 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">모든 상태</option>
            <option value="pending">주문접수</option>
            <option value="paid">결제완료</option>
            <option value="processing">처리중</option>
            <option value="shipped">배송중</option>
            <option value="delivered">배송완료</option>
            <option value="cancelled">주문취소</option>
          </select>

          {/* 결제 상태 필터 */}
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value as typeof filterPayment)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">모든 결제상태</option>
            <option value="pending">결제대기</option>
            <option value="paid">결제완료</option>
            <option value="failed">결제실패</option>
            <option value="refunded">환불완료</option>
          </select>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  결제상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문일시
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items.length}개 상품</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openOrderDetail(order)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">주문이 없습니다</h3>
            <p className="text-gray-500">검색 조건을 변경해보세요.</p>
          </div>
        )}
      </div>

      {/* 주문 상세 모달 */}
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

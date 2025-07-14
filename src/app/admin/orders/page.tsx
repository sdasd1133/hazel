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
  MoreVertical,
  Plus
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

  // 실제 주문 데이터를 로컬 스토리지에서 가져옵니다
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 로컬 스토리지에서 주문 데이터 가져오기
        const savedOrders = localStorage.getItem('userOrders');
        console.log('로컬스토리지 userOrders:', savedOrders); // 디버깅용
        
        if (savedOrders) {
          const userOrders = JSON.parse(savedOrders);
          console.log('파싱된 주문 데이터:', userOrders); // 디버깅용
          
          // 로컬 스토리지 주문 데이터를 관리자 주문 형식으로 변환
          const convertedOrders: Order[] = userOrders.map((order: any, index: number) => ({
            id: order.id || `order-${index}`,
            orderNumber: order.id || `ORDER-${Date.now()}-${index}`,
            customerId: 'user-1', // 임시 고객 ID
            customerName: order.shippingInfo?.name || '고객',
            customerEmail: 'customer@example.com', // 실제로는 주문자 정보에서 가져와야 함
            customerPhone: order.shippingInfo?.phone || '',
            status: order.status || 'pending',
            paymentMethod: 'bank_transfer' as const,
            paymentStatus: 'paid' as const,
            shippingAddress: {
              name: order.shippingInfo?.name || '',
              phone: order.shippingInfo?.phone || '',
              address: `${order.shippingInfo?.address1 || ''} ${order.shippingInfo?.address2 || ''}`.trim(),
              city: '서울', // 실제로는 주소에서 파싱해야 함
              zipCode: order.shippingInfo?.zipcode || ''
            },
            items: order.items?.map((item: any, itemIndex: number) => ({
              id: item.id || `item-${itemIndex}`,
              productName: item.product?.name || '상품명 없음',
              productImage: item.product?.images?.[0] || '/placeholder-product.jpg',
              size: item.selectedSize || '',
              color: item.selectedColor || '',
              quantity: item.quantity || 1,
              price: item.product?.price || 0
            })) || [],
            subtotal: order.totalAmount - (order.shippingFee || 0),
            shippingCost: order.shippingFee || 0,
            tax: 0, // 실제로는 계산해야 함
            total: order.totalAmount || 0,
            createdAt: order.createdAt || new Date().toISOString(),
            updatedAt: order.createdAt || new Date().toISOString(),
            notes: order.shippingInfo?.deliveryRequest || ''
          }));
          
          console.log('변환된 주문 데이터:', convertedOrders); // 디버깅용
          setOrders(convertedOrders);
        } else {
          console.log('로컬스토리지에 주문 데이터 없음'); // 디버깅용
          setOrders([]);
        }
      } catch (error) {
        console.error('주문 데이터 로드 실패:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
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
    // 관리자 페이지의 주문 목록 업데이트
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
    ));
    
    // 로컬 스토리지의 사용자 주문도 업데이트
    try {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        const userOrders = JSON.parse(savedOrders);
        const updatedUserOrders = userOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('userOrders', JSON.stringify(updatedUserOrders));
      }
    } catch (error) {
      console.error('로컬 스토리지 주문 상태 업데이트 실패:', error);
    }
    
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 로컬스토리지 주문 데이터 초기화 함수
  const clearAllOrders = () => {
    if (confirm('모든 주문 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('userOrders');
      setOrders([]);
      alert('모든 주문 데이터가 삭제되었습니다.');
    }
  };

  // 테스트 주문 데이터 생성 함수
  const createTestOrder = () => {
    try {
      const testOrder = {
        id: `ORDER-${Date.now()}`,
        status: 'pending' as const,
        items: [
          {
            id: 'test-product-1',
            product: {
              id: 'prod-1',
              name: '테스트 티셔츠',
              price: 50000,
              images: ['/placeholder-product.jpg']
            },
            quantity: 2,
            selectedSize: 'M',
            selectedColor: '블랙'
          },
          {
            id: 'test-product-2',
            product: {
              id: 'prod-2',
              name: '테스트 후디',
              price: 75000,
              images: ['/placeholder-product.jpg']
            },
            quantity: 1,
            selectedSize: 'L',
            selectedColor: '화이트'
          }
        ],
        shippingInfo: {
          name: '김테스트',
          phone: '010-1234-5678',
          zipcode: '12345',
          address1: '서울특별시 강남구 테헤란로 123',
          address2: '101호',
          deliveryRequest: '문앞에 놓아주세요'
        },
        totalAmount: 178000, // 상품 175000 + 배송비 3000
        shippingFee: 3000,
        createdAt: new Date().toISOString()
      };
      
      console.log('생성할 테스트 주문:', testOrder);
      
      // 기존 주문 목록 가져오기
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      console.log('기존 주문들:', existingOrders);
      
      // 새 주문 추가
      const updatedOrders = [testOrder, ...existingOrders];
      console.log('업데이트된 주문들:', updatedOrders);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      // 상태 업데이트로 즉시 반영
      const convertedOrder: Order = {
        id: testOrder.id,
        orderNumber: testOrder.id,
        customerId: 'user-1',
        customerName: testOrder.shippingInfo.name,
        customerEmail: 'customer@example.com',
        customerPhone: testOrder.shippingInfo.phone,
        status: testOrder.status,
        paymentMethod: 'bank_transfer' as const,
        paymentStatus: 'paid' as const,
        shippingAddress: {
          name: testOrder.shippingInfo.name,
          phone: testOrder.shippingInfo.phone,
          address: `${testOrder.shippingInfo.address1} ${testOrder.shippingInfo.address2}`.trim(),
          city: '서울',
          zipCode: testOrder.shippingInfo.zipcode
        },
        items: testOrder.items.map((item, itemIndex) => ({
          id: item.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: testOrder.totalAmount - testOrder.shippingFee,
        shippingCost: testOrder.shippingFee,
        tax: 0,
        total: testOrder.totalAmount,
        createdAt: testOrder.createdAt,
        updatedAt: testOrder.createdAt,
        notes: testOrder.shippingInfo.deliveryRequest
      };
      
      // 기존 주문 목록에 새 주문 추가
      setOrders(prev => [convertedOrder, ...prev]);
      
      alert(`테스트 주문이 생성되었습니다!\n주문번호: ${testOrder.id}`);
      
    } catch (error) {
      console.error('테스트 주문 생성 실패:', error);
      alert('테스트 주문 생성에 실패했습니다.');
    }
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
          <button
            onClick={createTestOrder}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            테스트 주문 추가
          </button>
          <button
            onClick={clearAllOrders}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            주문 데이터 초기화
          </button>
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

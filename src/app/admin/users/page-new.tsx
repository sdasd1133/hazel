'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, X, Clock, Shield, Mail, Calendar } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  lastLogin?: string;
  orderCount: number;
  totalSpent: number;
}

const UserStatusBadge = ({ status }: { status: User['status'] }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '승인 대기', icon: Clock },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: '승인됨', icon: UserCheck },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: '승인 거부', icon: X }
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

const UserRoleBadge = ({ role }: { role: User['role'] }) => {
  const roleConfig = {
    user: { bg: 'bg-blue-100', text: 'text-blue-800', label: '일반 사용자', icon: UserCheck },
    admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: '관리자', icon: Shield }
  };
  
  const config = roleConfig[role];
  const IconComponent = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <IconComponent className="h-3 w-3" />
      {config.label}
    </span>
  );
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | User['status']>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // 가상의 사용자 데이터 (승인 시스템 포함)
      const mockUsers: User[] = [
        {
          id: '1',
          name: '홍길동',
          email: 'hong@example.com',
          role: 'user',
          status: 'approved',
          createdAt: '2024-01-15',
          lastLogin: '2024-07-13',
          orderCount: 12,
          totalSpent: 1250000
        },
        {
          id: '2',
          name: '김영희',
          email: 'kim@example.com',
          role: 'user',
          status: 'pending',
          createdAt: '2024-07-14',
          orderCount: 0,
          totalSpent: 0
        },
        {
          id: '3',
          name: '관리자',
          email: 'admin@hazel.com',
          role: 'admin',
          status: 'approved',
          createdAt: '2023-12-01',
          lastLogin: '2024-07-13',
          orderCount: 0,
          totalSpent: 0
        },
        {
          id: '4',
          name: '이철수',
          email: 'lee@example.com',
          role: 'user',
          status: 'rejected',
          createdAt: '2024-07-10',
          orderCount: 0,
          totalSpent: 0
        },
        {
          id: '5',
          name: '박지영',
          email: 'park@example.com',
          role: 'user',
          status: 'pending',
          createdAt: '2024-07-13',
          orderCount: 0,
          totalSpent: 0
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleUserApproval = async (userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: newStatus }
            : user
        )
      );
      
      const user = users.find(u => u.id === userId);
      const statusText = newStatus === 'approved' ? '승인' : '거부';
      alert(`${user?.name}님의 계정이 ${statusText}되었습니다.`);
    } catch (error) {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = users.filter(user => user.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-600">사용자 승인 및 관리</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {pendingCount}명 승인 대기 중
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="사용자 검색..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | User['status'])}
            >
              <option value="all">모든 상태</option>
              <option value="pending">승인 대기</option>
              <option value="approved">승인됨</option>
              <option value="rejected">승인 거부</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  권한
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.orderCount}건
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUserApproval(user.id, 'approved')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleUserApproval(user.id, 'rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                        >
                          거부
                        </button>
                      </div>
                    )}
                    {user.status === 'rejected' && (
                      <button
                        onClick={() => handleUserApproval(user.id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >
                        승인
                      </button>
                    )}
                    {user.status === 'approved' && user.role !== 'admin' && (
                      <button
                        onClick={() => handleUserApproval(user.id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        차단
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">사용자가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">검색 조건에 맞는 사용자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

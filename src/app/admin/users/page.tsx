'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, UserCheck, UserX, Mail, Calendar, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin?: string;
  orderCount: number;
  totalSpent: number;
}

const UserStatusBadge = ({ status }: { status: User['status'] }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: '활성' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: '비활성' },
    banned: { bg: 'bg-red-100', text: 'text-red-800', label: '차단' }
  };
  
  const config = statusConfig[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
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
  const [filterRole, setFilterRole] = useState<'all' | User['role']>('all');

  // 실제 구현에서는 API에서 사용자 데이터를 가져옵니다
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // 가상의 사용자 데이터
      const mockUsers: User[] = [
        {
          id: '1',
          name: '홍길동',
          email: 'hong@example.com',
          role: 'user',
          status: 'active',
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
          status: 'active',
          createdAt: '2024-02-20',
          lastLogin: '2024-07-12',
          orderCount: 8,
          totalSpent: 890000
        },
        {
          id: '3',
          name: '관리자',
          email: 'admin@hazel.com',
          role: 'admin',
          status: 'active',
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
          status: 'inactive',
          createdAt: '2024-03-10',
          lastLogin: '2024-06-15',
          orderCount: 3,
          totalSpent: 180000
        },
        {
          id: '5',
          name: '박민수',
          email: 'park@example.com',
          role: 'user',
          status: 'banned',
          createdAt: '2024-01-25',
          lastLogin: '2024-05-20',
          orderCount: 2,
          totalSpent: 95000
        }
      ];
      
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 500);
    };

    fetchUsers();
  }, []);

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    // 실제 구현에서는 API 호출
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    // 실제 구현에서는 API 호출
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
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
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">총 {users.length}명</span>
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
              placeholder="이름 또는 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 상태 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="banned">차단</option>
          </select>

          {/* 역할 필터 */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">모든 역할</option>
            <option value="user">일반 사용자</option>
            <option value="admin">관리자</option>
          </select>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 로그인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문/구매금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
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
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ko-KR') : '없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{user.orderCount}건</div>
                      <div className="text-xs text-gray-500">
                        {user.totalSpent.toLocaleString()}원
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* 상태 변경 버튼 */}
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:border-transparent"
                      >
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                        <option value="banned">차단</option>
                      </select>

                      {/* 역할 변경 버튼 */}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:border-transparent"
                        disabled={user.email === 'admin@hazel.com'} // 메인 관리자는 변경 불가
                      >
                        <option value="user">일반</option>
                        <option value="admin">관리자</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">사용자가 없습니다</h3>
            <p className="text-gray-500">검색 조건을 변경해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useAuthStore } from '@/lib/supabase-auth';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    birthDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // 프로필 저장 로직
    alert('프로필이 저장되었습니다.');
  };

  const tabs = [
    { id: 'profile', name: '개인정보', icon: '👤' },
    { id: 'orders', name: '주문내역', icon: '📦' },
    { id: 'wishlist', name: '찜목록', icon: '❤️' },
    { id: 'settings', name: '설정', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}님</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  {user?.isAdmin && (
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mt-1">
                      관리자
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 사이드바 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg mr-3">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                  
                  {user?.isAdmin && (
                    <Link 
                      href="/admin"
                      className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center text-gray-700 hover:bg-gray-50"
                    >
                      <span className="text-lg mr-3">🛠️</span>
                      관리자 페이지
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">개인정보 관리</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이름
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이메일
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          연락처
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          placeholder="010-0000-0000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          생년월일
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={profileData.birthDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          주소
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          placeholder="주소를 입력하세요"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <button
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">주문내역</h2>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-500 mb-4">주문내역이 없습니다.</p>
                      <Link 
                        href="/products"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                      >
                        쇼핑하러 가기
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">찜목록</h2>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <p className="text-gray-500 mb-4">찜한 상품이 없습니다.</p>
                      <Link 
                        href="/products"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                      >
                        상품 둘러보기
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">설정</h2>
                    <div className="space-y-6">
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium mb-4">알림 설정</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded mr-3" defaultChecked />
                            <span>주문 상태 알림</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded mr-3" defaultChecked />
                            <span>프로모션 알림</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded mr-3" />
                            <span>마케팅 정보 수신</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium mb-4">계정 관리</h3>
                        <div className="space-y-3">
                          <button className="text-indigo-600 hover:text-indigo-800">
                            비밀번호 변경
                          </button>
                          <br />
                          <button className="text-red-600 hover:text-red-800">
                            계정 탈퇴
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

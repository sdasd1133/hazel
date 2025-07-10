"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 문의 제출 로직 (실제로는 서버로 전송)
    setTimeout(() => {
      alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const faqItems = [
    {
      question: '주문 취소는 어떻게 하나요?',
      answer: '주문 후 24시간 이내에는 마이페이지에서 직접 취소 가능합니다. 그 이후에는 고객센터로 연락해주세요.'
    },
    {
      question: '배송기간은 얼마나 걸리나요?',
      answer: '주문 후 2-3일 이내에 발송되며, 택배사에 따라 1-2일 추가 소요됩니다.'
    },
    {
      question: '교환/환불 정책이 궁금합니다.',
      answer: '상품 수령 후 7일 이내 교환/환불 가능합니다. 단, 착용이나 세탁 후에는 불가능합니다.'
    },
    {
      question: '회원가입 혜택이 있나요?',
      answer: '회원가입 시 즉시 사용 가능한 5,000원 적립금과 다양한 할인 혜택을 받으실 수 있습니다.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">고객센터</h1>
          <p className="text-gray-600 mt-2">궁금한 점이 있으시면 언제든지 문의해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 연락처 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">연락처 정보</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">고객센터</p>
                    <p className="text-gray-600">02-123-4567</p>
                    <p className="text-sm text-gray-500">평일 10:00-17:00</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600">✉️</span>
                  </div>
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-gray-600">customer@goodluckfashion.com</p>
                    <p className="text-sm text-gray-500">24시간 접수</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600">📍</span>
                  </div>
                  <div>
                    <p className="font-medium">매장 위치</p>
                    <p className="text-gray-600">부산광역시 동랙구</p>
                    <p className="text-gray-600">금강공원로33번길 5 3층</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600">⏰</span>
                  </div>
                  <div>
                    <p className="font-medium">운영시간</p>
                    <p className="text-gray-600">평일: 10:00-17:00</p>
                    <p className="text-gray-600">주말/공휴일: 휴무</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 빠른 링크 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">빠른 링크</h3>
              <div className="space-y-2">
                <Link href="/orders" className="block text-indigo-600 hover:text-indigo-800">
                  📦 주문내역 확인
                </Link>
                <Link href="/profile" className="block text-indigo-600 hover:text-indigo-800">
                  👤 회원정보 수정
                </Link>
                <Link href="/terms" className="block text-indigo-600 hover:text-indigo-800">
                  📋 이용약관
                </Link>
                <Link href="/privacy" className="block text-indigo-600 hover:text-indigo-800">
                  🔒 개인정보처리방침
                </Link>
              </div>
            </div>
          </div>

          {/* 문의 폼 및 FAQ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 문의 폼 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">1:1 문의하기</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      문의 유형 *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">선택해주세요</option>
                      <option value="order">주문/결제</option>
                      <option value="delivery">배송</option>
                      <option value="return">교환/환불</option>
                      <option value="product">상품</option>
                      <option value="account">회원/계정</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="문의하실 내용을 자세히 적어주세요."
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? '전송 중...' : '문의하기'}
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details key={index} className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <span className="font-medium text-gray-900">{item.question}</span>
                      <span className="text-gray-500 group-open:rotate-180 transition-transform">
                        ⌄
                      </span>
                    </summary>
                    <div className="mt-2 p-4 text-gray-600 bg-gray-50 rounded-lg">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

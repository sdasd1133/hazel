import Link from 'next/link';
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              HAZEL
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              트렌디하고 고품질의 패션을 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                쇼핑하기 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/about" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center"
              >
                브랜드 소개
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            왜 HAZEL을 선택해야 할까요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">프리미엄 품질</h3>
              <p className="text-gray-600">엄선된 소재와 정교한 제작 과정으로 만들어진 고품질 의류</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">빠른 배송</h3>
              <p className="text-gray-600">전국 무료배송 및 당일발송으로 빠르게 받아보세요</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">안전한 쇼핑</h3>
              <p className="text-gray-600">100% 정품보장과 안전한 결제 시스템으로 믿고 구매하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            인기 카테고리
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '여성 의류', href: '/category/women-clothing' },
              { name: '남성 의류', href: '/category/men-clothing' },
              { name: '액세서리', href: '/category/accessories' },
              { name: '신발', href: '/category/shoes' }
            ].map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group relative bg-gray-200 rounded-lg overflow-hidden aspect-square hover:shadow-lg transition-shadow flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative text-white text-center">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            특별한 할인 혜택을 놓치지 마세요
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            신규 회원가입 시 20% 할인 쿠폰 증정
          </p>
          <Link 
            href="/register" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            지금 가입하기
          </Link>
        </div>
      </section>
    </div>
  );
}

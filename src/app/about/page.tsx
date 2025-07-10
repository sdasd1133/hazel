import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GL GOOD LUCK FASHION</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            트렌디하고 스타일리시한 패션으로 당신의 일상을 더욱 특별하게 만들어드립니다.
          </p>
        </div>

        {/* 회사 소개 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">우리의 이야기</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  GL GOOD LUCK FASHION은 2020년에 시작된 온라인 패션 브랜드입니다. 
                  우리는 모든 사람이 자신만의 스타일을 표현할 수 있도록 다양하고 
                  트렌디한 의류를 합리적인 가격에 제공하고자 합니다.
                </p>
                <p>
                  고품질의 소재와 세련된 디자인을 통해 일상 속에서도 특별함을 
                  느낄 수 있는 패션 아이템들을 선보이고 있습니다. 
                  고객 한 분 한 분의 만족이 저희의 가장 큰 목표입니다.
                </p>
                <p>
                  지속가능한 패션을 추구하며, 환경을 생각하는 책임감 있는 
                  브랜드로 성장해 나가고 있습니다.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <span className="text-6xl">🏢</span>
            </div>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">우리의 핵심 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">품질</h3>
              <p className="text-gray-600">
                엄선된 소재와 꼼꼼한 제작 과정을 통해 
                최고 품질의 제품만을 제공합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">디자인</h3>
              <p className="text-gray-600">
                트렌드를 반영하면서도 개성있는 
                디자인으로 차별화된 스타일을 제안합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">신뢰</h3>
              <p className="text-gray-600">
                고객과의 약속을 지키며 
                신뢰할 수 있는 쇼핑 경험을 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">회사 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">기본 정보</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-24 text-gray-600">상호명:</span>
                  <span className="text-gray-900">GL GOOD LUCK FASHION</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-600">대표자:</span>
                  <span className="text-gray-900">홍길동</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-600">설립일:</span>
                  <span className="text-gray-900">2020년 3월</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-600">직원수:</span>
                  <span className="text-gray-900">25명</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">사업자 정보</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-gray-600">사업자등록번호:</span>
                  <span className="text-gray-900">123-45-67890</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">통신판매업신고:</span>
                  <span className="text-gray-900">제2020-부산동래-1234호</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">주소:</span>
                  <span className="text-gray-900">부산광역시 동랙구 금강공원로33번길 5 3층</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 연혁 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">연혁</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-20 text-indigo-600 font-bold">2025</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">리뉴얼 및 확장</h4>
                <p className="text-gray-600">웹사이트 리뉴얼 및 상품 카테고리 확장</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-20 text-indigo-600 font-bold">2024</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">매출 성장</h4>
                <p className="text-gray-600">연매출 10억원 달성 및 고객 만족도 95% 달성</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-20 text-indigo-600 font-bold">2022</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">사업 확장</h4>
                <p className="text-gray-600">온라인 전용 브랜드에서 O2O 서비스로 확장</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-20 text-indigo-600 font-bold">2020</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">회사 설립</h4>
                <p className="text-gray-600">GL GOOD LUCK FASHION 온라인 쇼핑몰 오픈</p>
              </div>
            </div>
          </div>
        </div>

        {/* 수상 및 인증 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">수상 및 인증</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">2024년</h4>
              <p className="text-sm text-gray-600">우수 온라인쇼핑몰</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">2023년</h4>
              <p className="text-sm text-gray-600">ISO 9001 인증</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">2022년</h4>
              <p className="text-sm text-gray-600">고객만족대상</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌱</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">2021년</h4>
              <p className="text-sm text-gray-600">친환경 인증</p>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">함께 성장해 나가요</h2>
          <p className="text-xl mb-8 opacity-90">
            GL GOOD LUCK FASHION과 함께 스타일리시한 일상을 만들어보세요
          </p>
          <div className="space-x-4">
            <Link 
              href="/products"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block font-medium"
            >
              상품 둘러보기
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors inline-block font-medium"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  ArrowRight 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-black pt-16 pb-8 mt-10 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* 뉴스레터 섹션 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-100 rounded-2xl p-8 text-center md:text-left md:flex justify-between items-center">
            <div className="mb-6 md:mb-0 md:max-w-md">
              <h3 className="text-2xl font-bold mb-2">뉴스레터 구독</h3>
              <p className="text-gray-600">신상품과 할인 소식을 가장 먼저 받아보세요</p>
            </div>
            <form className="flex">
              <input
                type="email"
                placeholder="이메일 주소"
                className="bg-white border border-gray-300 rounded-l-full px-5 py-3 min-w-[240px] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="btn-gradient rounded-r-full px-5 flex items-center"
              >
                구독하기
                <ArrowRight size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
        
        {/* 메인 푸터 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 회사 소개 */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-6">HAZEL</h3>
            <p className="text-gray-600 mb-6">
              트렌디한 의류와 패션 아이템을 제공하는 온라인 쇼핑몰입니다. 최신 트렌드와 고품질 제품을 만나보세요.
            </p>
            <div className="flex space-x-3">
              <Link href="https://instagram.com" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram size={16} />
              </Link>
              <Link href="https://facebook.com" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook size={16} />
              </Link>
              <Link href="https://twitter.com" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter size={16} />
              </Link>
              <Link href="https://youtube.com" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Youtube size={16} />
              </Link>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-semibold mb-6">연락처</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                <span className="text-gray-600">
                  서울특별시 강남구 테헤란로 123<br />
                  해즐빌딩 8층
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                <span className="text-gray-600">1588-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <a href="mailto:info@hazel.com" className="text-gray-600 hover:text-primary">
                  info@hazel.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 저작권 정보 */}
        <div className="border-t border-gray-200 pt-6 text-center md:flex md:justify-between md:text-left text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
            &copy; {currentYear} HAZEL. All Rights Reserved.
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <Link href="/privacy" className="hover:text-primary">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-primary">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

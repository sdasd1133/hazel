import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-black pt-16 pb-8 mt-10 border-t border-gray-200">
      <div className="container mx-auto px-4">
        
        {/* 메인 푸터 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 회사 소개 */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-6">HAZEL</h3>
            <p className="text-gray-600 mb-6">
              트렌디한 의류와 패션 아이템을 제공하는 온라인 쇼핑몰입니다. 최신 트렌드와 고품질 제품을 만나보세요.
            </p>
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

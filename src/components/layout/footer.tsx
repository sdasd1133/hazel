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
            <div className="mb-4 h-10 w-auto">
              <svg className="h-full w-auto" viewBox="0 0 450 450" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M246.5,135.5 L354,135.5 L354,217 L313,217 L313,172 L246.5,172 Z" />
                  <path d="M68,315 C68,272 92,249 139,249 C184,249 221,278 221,329 C221,378 183,408 131,408 C76,408 68,373 68,368 L113,368 C113,369 124,382 148,382 C177,382 173,350 173,347 L173,347 C164,360 146,366 124,366 C85,366 68,340 68,315 Z M138,295 C123,295 117,305 117,315 C117,325 123,335 138,335 C156,335 173,326 173,315 C173,304 156,295 138,295 Z" />
                  <path d="M254,249.5 L354,249.5 L354,286 L301,286 L301,408 L254,408 Z" />
                  <path d="M128,217 L128,196 L173,196 L173,217 L156,217 L156,225 L128,225 Z" />
                  <path d="M236,196 L236,217 L219,217 L219,225 L191,225 L191,217 L191,196 Z" />
                  <path d="M266,196 L294,196 L294,217 L266,217 Z" />
                  <path d="M299,196 L327,196 L327,217 L299,217 Z" />
                  <path d="M191,249.5 L236,249.5 L236,286 L191,286 Z" />
                  <path d="M146,393 L146,408 L173,408 L173,393 Z" />
                  <path d="M191,393 L191,408 L218,408 L218,393 Z" />
                  <path d="M226,393 L226,408 L253,408 L253,393 Z" />
                  <text x="225" y="250" fontFamily="Arial" fontSize="24" textAnchor="middle" fontWeight="bold">GOOD LUCK</text>
                  <text x="225" y="393" fontFamily="Arial" fontSize="24" textAnchor="middle">FASION</text>
                </g>
              </svg>
            </div>
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
            &copy; {currentYear} GL GOOD LUCK FASION. All Rights Reserved.
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

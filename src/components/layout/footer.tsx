import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="GL GOOD LUCK FASHION"
                className="h-10 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                고객센터: 02-123-4567 (평일 10:00-17:00)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                이메일: customer@goodluckfashion.com
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-right mt-4 md:mt-0">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              &copy; {new Date().getFullYear()} GL GOOD LUCK FASHION. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              사업자등록번호: 123-45-67890 | 대표: 홍길동
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              주소: 부산광역시 동랙구 금강공원로33번길 5 3층
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Link href="/" className="mb-2">
              <img
                src="/logo.png"
                alt="GL GOOD LUCK FASHION"
                className="h-12 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              고객센터: 02-123-4567 (평일 10:00-17:00, 점심시간 12:00-13:00)
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              이메일: customer@goodluckfashion.com
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              &copy; {new Date().getFullYear()} GL GOOD LUCK FASHION. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              사업자등록번호: 123-45-67890 | 대표: 홍길동
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              서울특별시 강남구 패션로 123, 글로벌빌딩 8층
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

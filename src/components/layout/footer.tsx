import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Link href="/" className="mb-4 sm:mb-0">
            <Image
              src="/logo.png"
              alt="HAZEL Logo"
              width={150}
              height={150}
              className="h-12 w-auto"
            />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} HAZEL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

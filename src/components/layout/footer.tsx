import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Link href="/" className="mb-4 sm:mb-0">
            <img
              src="/logo.png"
              alt="GL GOOD LUCK FASHION"
              className="h-12 w-auto"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GL GOOD LUCK FASHION. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface FooterSettings {
  companyName: string;
  businessNumber: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  copyrightText: string;
}

const Footer = () => {
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    companyName: 'GL GOOD LUCK FASHION',
    businessNumber: '123-45-67890',
    representative: '홍길동',
    address: '부산광역시 동래구 금강공원로33번길 5 3층',
    phone: '02-123-4567',
    email: 'customer@goodluckfashion.com',
    workingHours: '평일 10:00-17:00',
    copyrightText: 'GL GOOD LUCK FASHION. All rights reserved.',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('footerSettings');
      if (savedSettings) {
        setFooterSettings(JSON.parse(savedSettings));
      }
    }
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/gl-logo.svg"
                alt={footerSettings.companyName}
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                고객센터: {footerSettings.phone} ({footerSettings.workingHours})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                이메일: {footerSettings.email}
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-right mt-4 md:mt-0">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              &copy; {new Date().getFullYear()} {footerSettings.copyrightText}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              사업자등록번호: {footerSettings.businessNumber} | 대표: {footerSettings.representative}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              주소: {footerSettings.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

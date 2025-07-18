import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/auth-guard";
import ConditionalLayout from "@/components/layout/conditional-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GL GOOD LUCK FASHION - 트렌디한 의류 쇼핑몰",
  description: "최신 트렌드의 의류와 패션 아이템을 만나보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa]`}
      >
        <AuthGuard>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthGuard>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '2024 “大二杯” 结果发布',
  description: '“大二杯”（大学生二次元）2024年度动画评选结果发布与可视化',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-900 text-white min-h-screen`}
      >
        <div className="pb-16">
          {children}
        </div>
        <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-stone-400 border-t border-stone-800 bg-stone-900/80 backdrop-blur-sm z-50">
          <p>© {new Date().getFullYear()} 二维结系. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

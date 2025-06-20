// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 顶部导航
import BottomNavbar from "@/components/BottomNavbar"; // 底部导航
import { Toaster } from "@/components/ui/sonner"; // Toast 通知

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "菜单规划师",
  description: "轻松规划您的家庭菜单",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-gray-50`}>
        <Navbar /> {/* 顶部导航栏，它内部的样式会处理好在移动端的隐藏 */}
        
        {/* pb-20 是为了给底部的 BottomNavbar 留出空间，防止内容被遮挡 */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          {children}
        </main>
        
        <BottomNavbar /> {/* 底部导航栏，它内部的样式会处理好在桌面端的隐藏 */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
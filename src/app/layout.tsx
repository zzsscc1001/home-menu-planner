// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import { Toaster } from "@/components/ui/sonner";
import PageTransition from "@/components/PageTransition"; // 1. 导入动画组件

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
        <Navbar />
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          {/* 2. 用 PageTransition 包裹 children */}
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        
        <BottomNavbar />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
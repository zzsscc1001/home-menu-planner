// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"; // 👈 1. 确认这一行导入存在

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "家庭菜单规划师",
  description: "轻松规划每一餐",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <Navbar />
        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Toaster richColors position="top-right" /> 
        {/* 
          👆 2. 确认这一行存在，并且在 </body> 标签之前。
             我添加了 position="top-right" 让位置更明确。
             richColors 属性可以让 success, error 等状态有不同的颜色。
        */}
      </body>
    </html>
  );
}
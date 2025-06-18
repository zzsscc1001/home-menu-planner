// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- 1. 导入新的 Navbar 组件

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
        
        <Navbar /> {/* <--- 2. 在这里使用 Navbar 组件 */}

        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
      </body>
    </html>
  );
}
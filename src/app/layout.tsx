// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

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
      <body className={`${inter.className} bg-gray-100 text-gray-900`}> {/* 把背景色改得深一点，比如 gray-100 */}
        <header className="bg-white shadow-sm"> {/* 改用 header 标签更语义化 */}
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  🍽️
                  <span>菜单规划师</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    首页
                  </Link>
                  <Link href="/menu" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    菜单
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* 把 main 标签移到这里 */}
        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
      </body>
    </html>
  );
}
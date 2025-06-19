// src/components/Navbar.tsx
'use client'; // <--- 这行是关键！声明这是一个客户端组件

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/menu', label: '菜单' },
    { href: '/calendar', label: '日历' }, 
    { href: '/wishlist', label: '愿望单' }, // <--- 在这里添加新链接
  ];


  return (
    <header className="bg-white shadow-sm sticky top-0 z-10"> {/* 让导航栏吸顶 */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/标题 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🍽️
              <span className="hidden sm:inline">菜单规划师</span> {/* 在超小屏幕上只显示图标 */}
            </Link>
          </div>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-baseline space-x-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          {/* 移动端汉堡按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* 根据 isMenuOpen 状态显示不同图标 */}
              {isMenuOpen ? (
                // 关闭图标 (X)
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // 汉堡图标 (三条横线)
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端展开菜单 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // 点击链接后关闭菜单
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
// src/components/BottomNavbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, CalendarDays, ListPlus } from 'lucide-react';

const navLinks = [
  { href: '/', label: '首页', icon: Home },
  { href: '/menu', label: '菜单', icon: UtensilsCrossed },
  { href: '/calendar', label: '日历', icon: CalendarDays },
  { href: '/wishlist', label: '愿望单', icon: ListPlus },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    // 这个导航栏只在移动端显示（屏幕宽度小于 md）
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-20">
      <div className="flex justify-around h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex flex-col items-center justify-center w-full text-sm transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
// src/components/HomeView.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Dish } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface HomeViewProps {
  initialDish: Dish | null; // 接收服务器端预加载的第一个菜品
}

// 一个专门用于展示菜品信息的卡片组件
const DishCard = ({ dish }: { dish: Dish }) => (
  <div className="bg-white border rounded-lg p-6 shadow-lg w-full max-w-md text-center">
    <p className="text-sm text-gray-500 mb-2">不知道吃什么？试试这个！</p>
    <h2 className="text-3xl font-bold text-gray-800">{dish.name}</h2>
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{dish.category}</span>
      {dish.tags?.map((tag) => (
        <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {tag}
        </span>
      ))}
    </div>
    <div className="mt-6">
      <p className="text-gray-600 line-clamp-3">{dish.recipe}</p>
    </div>
    <Link href="/menu" className="mt-6 inline-block">
      <Button>去菜单里看看</Button>
    </Link>
  </div>
);

// 一个用于显示加载或错误状态的卡片
const PlaceholderCard = ({ message, isLoading }: { message: string, isLoading?: boolean }) => (
  <div className="bg-white border rounded-lg p-6 shadow-lg w-full max-w-md text-center h-[290px] flex flex-col justify-center items-center">
    {isLoading ? (
      <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
    ) : (
      <p className="text-gray-500">{message}</p>
    )}
  </div>
);

export default function HomeView({ initialDish }: HomeViewProps) {
  const [dish, setDish] = useState<Dish | null>(initialDish);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomDish = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/menu/random');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDish(data);
    } catch {
      setDish(null); // 如果出错，清空菜品
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">欢迎回来！</h1>
      <p className="text-lg text-gray-600 mb-10">开始您今天的美味之旅吧。</p>

      {isLoading 
        ? <PlaceholderCard message="正在寻找灵感..." isLoading />
        : dish 
          ? <DishCard dish={dish} /> 
          : <PlaceholderCard message="菜单是空的，快去添加一个吧！" />
      }

      <Button 
        onClick={fetchRandomDish} 
        disabled={isLoading} 
        variant="outline" 
        className="mt-6"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        换一个
      </Button>
    </div>
  );
}
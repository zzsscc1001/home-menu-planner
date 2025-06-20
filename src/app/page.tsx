// src/app/page.tsx
import { getFullMenu } from '@/lib/data';
import HomeView from '@/components/HomeView';
import type { Dish } from '@/lib/types';

export default async function HomePage() {
  let initialDish: Dish | null = null;
  
  try {
    const { allDishes } = await getFullMenu();
    if (allDishes.length > 0) {
      const randomIndex = Math.floor(Math.random() * allDishes.length);
      initialDish = allDishes[randomIndex];
    }
  } catch (error) {
    console.error("Failed to fetch initial random dish:", error);
    // 如果出错，initialDish 保持为 null，前端会处理这个情况
  }

  return <HomeView initialDish={initialDish} />;
}
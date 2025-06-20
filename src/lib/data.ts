// src/lib/data.ts
import { redis } from './redis'; // 导入我们统一的客户端
import staticMenu from '@/data/menu.json';
import type { Dish } from './types';

export async function getFullMenu(): Promise<Dish[]> {
  try {
    const dynamicMenuObject = await redis.hgetall('menu');
    const dynamicMenu = dynamicMenuObject ? (Object.values(dynamicMenuObject) as Dish[]) : [];
    const fullMenu = [...(staticMenu as Dish[]), ...dynamicMenu];
    const uniqueMenu = Array.from(new Map(fullMenu.map(item => [item.id, item])).values());
    return uniqueMenu;
  } catch (error) {
    console.error("Failed to fetch full menu:", error);
    return staticMenu as Dish[];
  }
}
// src/lib/data.ts
import { redis } from './redis';
import staticMenu from '@/data/menu.json';
import type { Dish } from './types';

// 返回一个包含菜品列表和动态菜品ID集合的对象
export async function getFullMenu(): Promise<{ allDishes: Dish[], dynamicDishIds: Set<string> }> {
  try {
    const dynamicMenuObject = await redis.hgetall('menu');
    const dynamicMenu: Dish[] = dynamicMenuObject ? (Object.values(dynamicMenuObject) as Dish[]) : [];
    const dynamicDishIds = new Set(dynamicMenu.map(dish => dish.id));
    
    const fullMenu = [...(staticMenu as Dish[]), ...dynamicMenu];
    
    const uniqueMenu = Array.from(new Map(fullMenu.map(item => [item.id, item])).values());
    
    return { allDishes: uniqueMenu, dynamicDishIds };
  } catch (error) {
    console.error("Failed to fetch full menu:", error);
    // 如果 Redis 出错，动态菜品为空
    return { allDishes: staticMenu as Dish[], dynamicDishIds: new Set() };
  }
}
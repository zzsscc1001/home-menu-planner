// src/lib/data.ts
import { Redis } from '@upstash/redis';
import staticMenu from '@/data/menu.json';

const redis = Redis.fromEnv();

interface Dish {
  id: string;
  name: string;
  recipe: string;
  category: string;
  tags: string[];
}

export async function getFullMenu(): Promise<Dish[]> {
  try {
    // 从 Redis Hash 获取所有动态菜品
    const dynamicMenuObject = await redis.hgetall('menu');
    const dynamicMenu = dynamicMenuObject ? Object.values(dynamicMenuObject) as Dish[] : [];
    
    // 合并静态菜单和动态菜单
    const fullMenu = [...staticMenu, ...dynamicMenu];
    
    // 去重，以防万一有重复的 ID
    const uniqueMenu = Array.from(new Map(fullMenu.map(item => [item.id, item])).values());
    
    return uniqueMenu;
  } catch (error) {
    console.error("Failed to fetch full menu:", error);
    // 如果 Redis 出错，至少返回静态菜单
    return staticMenu as Dish[];
  }
}
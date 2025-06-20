// src/app/api/menu/edit/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import type { Dish, MealSchedule } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const dishToUpdate: Dish = await request.json();

    if (!dishToUpdate || !dishToUpdate.id) {
      return NextResponse.json({ error: 'Invalid dish data' }, { status: 400 });
    }

    // --- 核心联动逻辑开始 ---

    // 1. 获取所有排期相关的 keys
    const scheduleKeys: string[] = [];
    let cursor: string = '0';
    do {
      const [nextCursor, foundKeys] = await redis.scan(cursor, { match: 'schedule:*' });
      if (foundKeys.length > 0) {
        scheduleKeys.push(...foundKeys);
      }
      cursor = nextCursor;
    } while (cursor !== '0');

    // 2. 遍历每一个排期，检查并更新菜品信息（主要是名字）
    if (scheduleKeys.length > 0) {
      for (const key of scheduleKeys) {
        const schedule = await redis.get<MealSchedule>(key);

        if (schedule) {
          let needsUpdate = false;

          const updateDishName = (dishes: {id: string, name: string}[]) => {
            return dishes.map(dish => {
              if (dish.id === dishToUpdate.id && dish.name !== dishToUpdate.name) {
                needsUpdate = true;
                return { ...dish, name: dishToUpdate.name };
              }
              return dish;
            });
          };
          
          const updatedBreakfast = updateDishName(schedule.breakfast);
          const updatedLunch = updateDishName(schedule.lunch);
          const updatedDinner = updateDishName(schedule.dinner);
          
          // 如果有任何一餐发生了变化，就更新整个排期数据
          if (needsUpdate) {
            await redis.set(key, {
              breakfast: updatedBreakfast,
              lunch: updatedLunch,
              dinner: updatedDinner,
            });
          }
        }
      }
    }

    // 3. 最后，更新主菜单中的菜品数据
    await redis.hset('menu', { [dishToUpdate.id]: dishToUpdate });

    return NextResponse.json(dishToUpdate, { status: 200 });

  } catch (error) {
    console.error('Failed to update dish and sync schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
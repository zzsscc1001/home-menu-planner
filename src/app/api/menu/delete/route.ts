// src/app/api/menu/delete/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import type { MealSchedule } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { id: dishIdToDelete } = await request.json();

    if (!dishIdToDelete) {
      return NextResponse.json({ error: 'Dish ID is required' }, { status: 400 });
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

    // 2. 遍历每一个排期，检查并清理被删除的菜品
    if (scheduleKeys.length > 0) {
      for (const key of scheduleKeys) {
        const schedule = await redis.get<MealSchedule>(key);

        if (schedule) {
          let needsUpdate = false;

          // 检查并过滤早餐、午餐、晚餐
          const updatedBreakfast = schedule.breakfast.filter(dish => dish.id !== dishIdToDelete);
          if (updatedBreakfast.length !== schedule.breakfast.length) needsUpdate = true;

          const updatedLunch = schedule.lunch.filter(dish => dish.id !== dishIdToDelete);
          if (updatedLunch.length !== schedule.lunch.length) needsUpdate = true;

          const updatedDinner = schedule.dinner.filter(dish => dish.id !== dishIdToDelete);
          if (updatedDinner.length !== schedule.dinner.length) needsUpdate = true;

          // 如果有任何一餐发生了变化，就更新整个排期数据
          if (needsUpdate) {
            const updatedSchedule: MealSchedule = {
              breakfast: updatedBreakfast,
              lunch: updatedLunch,
              dinner: updatedDinner,
            };

            // 如果更新后当天没有任何安排了，就直接删除这个key，保持数据整洁
            if (updatedSchedule.breakfast.length === 0 && updatedSchedule.lunch.length === 0 && updatedSchedule.dinner.length === 0) {
              await redis.del(key);
            } else {
              await redis.set(key, updatedSchedule);
            }
          }
        }
      }
    }

    // 3. 最后，从主菜单中删除该菜品
    const result = await redis.hdel('menu', dishIdToDelete);

    if (result === 0) {
      // 即使在排期中清理了，也可能主菜单里已经没有了，这不算一个严重错误
      // 但为了前端能正确响应，我们仍然可以认为操作是成功的
      console.warn(`Dish with id ${dishIdToDelete} not found in 'menu' hash, but cleaning schedule was attempted.`);
    }

    return NextResponse.json({ message: 'Dish deleted and schedules cleaned successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to delete dish and clean schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
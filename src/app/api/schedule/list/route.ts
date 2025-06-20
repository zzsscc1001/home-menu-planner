// src/app/api/schedule/list/route.ts
import { redis } from '@/lib/redis'; // 导入我们统一的客户端
import { NextResponse } from 'next/server';
import type { MealSchedule } from '@/lib/types';

export async function GET() {
  try {
    const keys: string[] = [];
    let cursor: string = '0';
    do {
      const [nextCursor, foundKeys] = await redis.scan(cursor, { match: 'schedule:*' });
      if (foundKeys.length > 0) {
        keys.push(...foundKeys);
      }
      cursor = nextCursor;
    } while (cursor !== '0');

    if (keys.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 核心优化：使用 mget 批量获取所有 key 的值
    // 使用 MealSchedule 类型代替 any
    const values = await redis.mget<(MealSchedule | null)[]>(...keys);

    const scheduledDates: string[] = [];
    values.forEach((value, index) => {
      // 检查 value 是否存在且不为空
      if (value && (value.breakfast?.length || value.lunch?.length || value.dinner?.length)) {
        scheduledDates.push(keys[index].replace('schedule:', ''));
      }
    });

    return NextResponse.json(scheduledDates, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch scheduled dates list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
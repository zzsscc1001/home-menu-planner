// src/app/api/schedule/list/route.ts
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET() {
  try {
    // ... (scan 逻辑保持不变，获取所有 keys) ...
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
    const values = await redis.mget<({ breakfast: any[], lunch: any[], dinner: any[] } | null)[]>(...keys);

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
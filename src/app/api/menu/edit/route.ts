// src/app/api/menu/edit/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import type { Dish } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const dishToUpdate: Dish = await request.json();

    if (!dishToUpdate || !dishToUpdate.id) {
      return NextResponse.json({ error: 'Invalid dish data' }, { status: 400 });
    }

    // 更新 'menu' 这个 Hash 中对应的菜品
    // hset 会覆盖已有的 field，如果不存在则会创建
    await redis.hset('menu', { [dishToUpdate.id]: dishToUpdate });

    return NextResponse.json(dishToUpdate, { status: 200 });

  } catch (error) {
    console.error('Failed to update dish:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
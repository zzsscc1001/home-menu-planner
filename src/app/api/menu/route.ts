// src/app/api/menu/delete/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Dish ID is required' }, { status: 400 });
    }

    // 从 'menu' 这个 Hash 中删除指定的 field (即菜品ID)
    const result = await redis.hdel('menu', id);

    if (result === 0) {
      // 如果 hdel 返回 0，说明没有找到对应的菜品
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Dish deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to delete dish:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
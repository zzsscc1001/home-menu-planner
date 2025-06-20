// src/app/api/menu/random/route.ts
import { getFullMenu } from '@/lib/data';
import { NextResponse } from 'next/server';

// 告诉 Next.js 这个路由是动态的，每次请求都重新执行
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { allDishes } = await getFullMenu();

    if (allDishes.length === 0) {
      return NextResponse.json({ error: 'No dishes available' }, { status: 404 });
    }

    // 从所有菜品中随机挑选一个
    const randomIndex = Math.floor(Math.random() * allDishes.length);
    const randomDish = allDishes[randomIndex];

    return NextResponse.json(randomDish, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch random dish:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
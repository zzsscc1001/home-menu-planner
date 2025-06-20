// src/app/api/wishlist/approve/route.ts
// src/app/api/wishlist/approve/route.ts
import { redis } from '@/lib/redis'; // 导入我们统一的客户端
import { NextResponse } from 'next/server';
import type { WishlistItem, Dish } from '@/lib/types'; // 导入类型

export async function POST(request: Request) {
  try {
    const itemToApprove: WishlistItem = await request.json();

    if (!itemToApprove || !itemToApprove.id) {
      return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
    }

    // 1. 将愿望单项目转换为正式菜单项目 (数据结构可能相同，但这是逻辑上的转换)
    const newDish: Dish = { ...itemToApprove };

    // 2. 将新菜品添加到主菜单 (我们用一个 Hash 结构来存主菜单)
    // Hash 的 field 是菜品 id，value 是菜品对象
    await redis.hset('menu', { [newDish.id]: newDish });

    // 3. 从愿望单列表中删除该项目
    await redis.lrem('wishlist', 1, itemToApprove);

    return NextResponse.json(newDish, { status: 200 });

  } catch (error) {
    console.error('Failed to approve item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
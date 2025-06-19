// src/app/api/wishlist/approve/route.ts
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

interface WishlistItem {
  id: string;
  name: string;
  recipe: string;
  category: '菜' | '汤' | '主食';
  tags: string[];
}

// 我们需要一个主菜单菜品的数据类型
interface Dish {
  id: string;
  name: string;
  recipe: string;
  category: '菜' | '汤' | '主食';
  tags: string[];
}

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
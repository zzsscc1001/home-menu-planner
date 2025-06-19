// src/app/api/wishlist/route.ts
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // 用于生成唯一 ID

const redis = Redis.fromEnv();

// 定义愿望单菜品的数据类型
interface WishlistItem {
  id: string;
  name: string;
  recipe: string;
  // 我们可以为愿望单菜品也加上分类和标签，方便批准时直接使用
  category: '菜' | '汤' | '主食';
  tags: string[];
}

// GET: 获取所有愿望单项目
export async function GET() {
  try {
    const wishlist = await redis.lrange('wishlist', 0, -1) as WishlistItem[];
    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: 添加一个新的愿望单项目
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, recipe, category, tags } = body;

    if (!name || !recipe || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem: WishlistItem = {
      id: uuidv4(),
      name,
      recipe,
      category,
      tags: tags || [],
    };

    // 使用 lpush 将新项目添加到列表的开头
    await redis.lpush('wishlist', newItem);

    return NextResponse.json(newItem, { status: 201 }); // 201: Created
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: 从愿望单中删除一个项目
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idToDelete = searchParams.get('id');

    if (!idToDelete) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    // lrem 会从列表中移除与指定 value 匹配的元素
    // 这是一个复杂操作，因为我们需要先找到要删除的对象
    const list = await redis.lrange('wishlist', 0, -1) as WishlistItem[];
    const itemToDelete = list.find(item => item.id === idToDelete);

    if (itemToDelete) {
      await redis.lrem('wishlist', 1, itemToDelete);
      return NextResponse.json({ message: 'Item deleted' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete from wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
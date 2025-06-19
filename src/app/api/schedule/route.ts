// src/app/api/schedule/route.ts
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// 初始化 Redis 客户端
// fromEnv() 会自动从你的 .env.development.local 或 Vercel 环境变量中读取连接信息
const redis = Redis.fromEnv();

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { date, meals } = body;
  
      if (!date || !meals) {
        return NextResponse.json({ error: 'Missing date or meals data' }, { status: 400 });
      }
  
      const key = `schedule:${date}`;
  
      // 核心逻辑修改：检查 meals 是否为空
      const isEmpty = 
        !meals.breakfast?.length && 
        !meals.lunch?.length && 
        !meals.dinner?.length;
  
      if (isEmpty) {
        // 如果三餐都为空，则从数据库中删除这个 key
        await redis.del(key);
        return NextResponse.json({ message: 'Schedule deleted successfully' }, { status: 200 });
      } else {
        // 如果不为空，则正常保存
        await redis.set(key, meals);
        return NextResponse.json({ message: 'Schedule saved successfully' }, { status: 200 });
      }
  
    } catch (error) {
      console.error('Failed to save/delete schedule:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

export async function GET(request: Request) {
    try {
      // 1. 从请求 URL 中获取日期参数
      const { searchParams } = new URL(request.url);
      const date = searchParams.get('date');
  
      if (!date) {
        return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
      }
  
      // 2. 从 Redis 中获取数据
      const key = `schedule:${date}`;
      const data = await redis.get(key);
  
      // 3. 如果找不到数据，返回一个空对象
      if (!data) {
        return NextResponse.json(null, { status: 200 });
      }
  
      // 4. 返回找到的数据
      return NextResponse.json(data, { status: 200 });
  
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
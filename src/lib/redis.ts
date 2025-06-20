// src/lib/redis.ts
import { Redis } from '@upstash/redis';

// fromEnv() 是 Upstash 官方推荐的方式，它能智能地从环境变量中
// 读取所有必要的认证信息 (包括 URL, token 等)。
// 这比我们手动 new Redis(...) 更健壮，尤其是在 Vercel 平台上。
export const redis = Redis.fromEnv();
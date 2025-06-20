// src/app/calendar/page.tsx
import CalendarView from '@/components/CalendarView';
import { getFullMenu } from '@/lib/data'; // 导入新函数

export default async function CalendarPage() { // 改为 async 函数
  const dishes = await getFullMenu(); // 调用新函数获取数据
  return <CalendarView dishes={dishes} />;
}
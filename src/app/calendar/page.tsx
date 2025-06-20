// src/app/calendar/page.tsx
import CalendarView from '@/components/CalendarView';
import { getFullMenu } from '@/lib/data';

export default async function CalendarPage() {
  // 从 getFullMenu 返回的对象中解构出我们需要的 allDishes
  const { allDishes } = await getFullMenu(); 
  
  // 将菜品数组（现在是 allDishes）传递给 CalendarView
  return <CalendarView dishes={allDishes} />;
}
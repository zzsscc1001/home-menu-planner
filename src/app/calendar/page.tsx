// src/app/calendar/page.tsx
import CalendarView from '@/components/CalendarView';
import { getFullMenu } from '@/lib/data';

export default async function CalendarPage() {
  const { allDishes } = await getFullMenu(); 
  
  return (
    <div>
      {/* 将标题和描述放在页面级组件中 */}
      <h1 className="text-3xl font-bold tracking-tight mb-4">排期日历</h1>
      <p className="text-gray-600 mb-8">点击一个未来的日期来安排您的三餐吧！</p>
      
      {/* CalendarView 现在只负责渲染日历本身 */}
      <CalendarView dishes={allDishes} />
    </div>
  );
}
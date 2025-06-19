// src/app/calendar/page.tsx
import menuData from '@/data/menu.json';
import CalendarView from '@/components/CalendarView';

export default function CalendarPage() {
  // 1. 在服务端安全地加载数据
  const dishes = menuData;

  // 2. 渲染客户端组件，并将数据作为 prop 传入
  return <CalendarView dishes={dishes} />;
}
// src/components/CalendarView.tsx
'use client';

import { useState, useEffect } from 'react'; // 引入 useEffect
import { Calendar } from "@/components/ui/calendar";
import MealPlannerModal from '@/components/MealPlannerModal';

// 1. 定义菜品类型和组件 Props 类型
interface Dish {
  id: string;
  name: string;
  category: string;
  recipe: string;
  tags: string[];
}

interface CalendarViewProps {
  dishes: Dish[];
}

// 2. 将组件改为接收 props
export default function CalendarView({ dishes }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);

  // 新增状态来存储已安排的日期
  const [scheduledDays, setScheduledDays] = useState<Date[]>([]);

  const handleDayClick = (day: Date) => {
    // 我们不再需要 if (selectedDate) 的判断，因为每次点击都有效
    setDate(day); // 更新日历上的高亮
    setSelectedDateForModal(day); // 准备给模态框的日期
    setIsModalOpen(true); // 打开模态框
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 新增一个 useEffect 来在组件加载时获取已安排日期列表
  useEffect(() => {
    const fetchScheduledDays = async () => {
      try {
        const response = await fetch('/api/schedule/list');
        if (!response.ok) throw new Error('Failed to fetch');
        const dates: string[] = await response.json();
        // 将字符串日期 "YYYY-MM-DD" 转换为 Date 对象
        const dateObjects = dates.map(dateStr => {
          const [year, month, day] = dateStr.split('-').map(Number);
          // 注意：月份在 Date 对象中是 0-11，所以要减 1
          return new Date(year, month - 1, day);
        });
        setScheduledDays(dateObjects);
      } catch (error) {
        console.error(error);
      }
    };
    fetchScheduledDays();
  }, [isModalOpen]); // 当模态框关闭时，重新获取列表，以更新标记

  // 定义一个 modifier，用于匹配已安排的日期
  const modifiers = {
    scheduled: scheduledDays,
  };

  // 为这个 modifier 定义一个 CSS 类名
  const modifiersClassNames = {
    scheduled: 'day-scheduled',
  };

  return (
    <div>
      {/* ... h1 and p tags ... */}
      
      <div className="flex justify-center bg-white p-4 rounded-lg shadow-sm border">
        <Calendar
          mode="single"
          selected={date}
          // onSelect={handleDateSelect} // <--- 移除 onSelect
          onDayClick={handleDayClick} // <--- 使用 onDayClick
          className="rounded-md"
          fromDate={new Date()}
          toDate={new Date(new Date().setDate(new Date().getDate() + 13))}
          classNames={{
            today: "bg-blue-100 text-blue-800 rounded-full",
          }}
          modifiers={modifiers} // <--- 添加 modifiers
          modifiersClassNames={modifiersClassNames} // <--- 添加对应的类名
        />
      </div>

      {/* 5. 在页面底部渲染模态框组件 */}
      <MealPlannerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDateForModal}
        dishes={dishes} // 3. 把菜品数据传递给模态框
      />
    </div>
  );
}
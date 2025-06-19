// src/components/CalendarView.tsx
'use client';

import { useState } from 'react';
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

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedDateForModal(selectedDate);
      setIsModalOpen(true);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">膳食日历</h1>
      <p className="text-gray-600 mb-8">点击一个有效的日期来安排当天的菜单。</p>
      
      <div className="flex justify-center bg-white p-4 rounded-lg shadow-sm border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md"
          fromDate={new Date()}
          toDate={new Date(new Date().setDate(new Date().getDate() + 13))}
          // 添加一些样式，让今天的日期更突出
          classNames={{
            today: "bg-blue-100 text-blue-800 rounded-full",
          }}
        />
      </div>

      {/* 移除之前用于测试的展示信息区域 */}
      {/* ... */}

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
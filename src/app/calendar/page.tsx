// src/app/calendar/page.tsx
'use client';

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import MealPlannerModal from '@/components/MealPlannerModal'; // 1. 导入我们的新组件

export default function CalendarPage() {
  // 日期状态保持不变
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // 2. 新增两个状态来管理模态框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);

  // 3. 修改日期选择处理函数
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedDateForModal(selectedDate); // 保存选择的日期
      setIsModalOpen(true); // 打开模态框
    }
  };
  
  // 4. 定义关闭模态框的函数
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 可以在这里选择是否清除 selectedDateForModal，通常不需要
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
      />
    </div>
  );
}
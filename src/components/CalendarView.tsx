// src/components/CalendarView.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import MealPlannerModal from '@/components/MealPlannerModal';
import type { Dish } from '@/lib/types';
import { MealSchedule } from '@/lib/types';

interface CalendarViewProps {
  dishes: Dish[];
}

export default function CalendarView({ dishes }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
  const [scheduledDays, setScheduledDays] = useState<Date[]>([]);

  const fetchScheduledDays = async () => {
    try {
      const response = await fetch('/api/schedule/list');
      if (!response.ok) throw new Error('Failed to fetch');
      const dates: string[] = await response.json();
      const dateObjects = dates.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      });
      setScheduledDays(dateObjects);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchScheduledDays();
  }, []);

  const handleDayClick = (day: Date) => {
    setDate(day);
    setSelectedDateForModal(day);
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    // 当模态框关闭时（通常意味着有数据更新），重新获取排期标记
    fetchScheduledDays();
  };

  const modifiers = { scheduled: scheduledDays };
  const modifiersClassNames = { scheduled: 'day-scheduled' };

  return (
    <>
      <div className="flex justify-center bg-white p-2 sm:p-4 rounded-lg shadow-sm border">
        <Calendar
          mode="single"
          selected={date}
          onDayClick={handleDayClick}
          className="rounded-md"
          fromDate={new Date()}
          toDate={new Date(new Date().setDate(new Date().getDate() + 13))}
          classNames={{
            today: "bg-blue-100 text-blue-800 rounded-full",
          }}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </div>

      <MealPlannerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDateForModal}
        dishes={dishes}
      />
    </>
  );
}
// src/components/MealPlannerModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DishSelector } from './DishSelector'; // 导入菜品选择器
import { X } from 'lucide-react'; // 导入 X 图标

interface Dish {
  id: string;
  name: string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface PlannedMeals {
  breakfast: Dish[];
  lunch: Dish[];
  dinner: Dish[];
}

interface MealPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  dishes: Dish[]; // 接收完整的菜单
}

export default function MealPlannerModal({ isOpen, onClose, selectedDate, dishes }: MealPlannerModalProps) {
  // 用来存储当前模态框中三餐安排的状态
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeals>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  // 当模态框打开时（selectedDate 变化时），重置状态
  useEffect(() => {
    // 在这里，未来可以从数据库加载当天的已有安排
    setPlannedMeals({ breakfast: [], lunch: [], dinner: [] });
  }, [selectedDate]);

  if (!selectedDate) return null;

  const handleAddDish = (mealType: MealType, dish: Dish) => {
    setPlannedMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], dish],
    }));
  };

  const handleRemoveDish = (mealType: MealType, dishId: string) => {
    setPlannedMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(d => d.id !== dishId),
    }));
  };

  const formattedDate = selectedDate.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });
  
  const MealSection = ({ title, mealType }: { title: string; mealType: MealType }) => (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <DishSelector dishes={dishes} onSelect={(dish) => handleAddDish(mealType, dish)} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {plannedMeals[mealType].length > 0 ? (
          plannedMeals[mealType].map(dish => (
            <div key={dish.id} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span>{dish.name}</span>
              <button onClick={() => handleRemoveDish(mealType, dish.id)} className="text-gray-500 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">暂无安排</p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{formattedDate}</DialogTitle>
          <DialogDescription>为这一天计划好美味的三餐吧！</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <MealSection title="早餐 🥣" mealType="breakfast" />
          <MealSection title="午餐 🍱" mealType="lunch" />
          <MealSection title="晚餐 🍝" mealType="dinner" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button type="submit">保存安排</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
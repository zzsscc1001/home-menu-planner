// src/components/MealPlannerModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DishSelector } from './DishSelector';
import { X } from 'lucide-react';
import { toast } from "sonner";

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
  // ==================================================================
  // 修正：把所有 Hooks 都移到组件的最顶层
  // ==================================================================
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeals>({
      breakfast: [],
      lunch: [],
      dinner: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // 这个 useEffect 现在有了新的使命：加载数据！
  useEffect(() => {
    // 只在模态框打开并且有选定日期时执行
    if (isOpen && selectedDate) {
      const fetchSchedule = async () => {
        setIsSaving(true); // 可以复用 isSaving 状态来显示加载中
        try {
          const dateKey = formatDateForKey(selectedDate);
          const response = await fetch(`/api/schedule?date=${dateKey}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch schedule');
          }

          const data = await response.json();
          
          if (data) {
            // 如果数据库中有数据，就用它来设置状态
            setPlannedMeals(data);
          } else {
            // 如果没有数据，就重置为空状态
            setPlannedMeals({ breakfast: [], lunch: [], dinner: [] });
          }

        } catch (error) {
          console.error(error);
          toast.error("加载当天安排失败。");
          // 即使加载失败，也要保证是一个空状态
          setPlannedMeals({ breakfast: [], lunch: [], dinner: [] });
        } finally {
          setIsSaving(false);
        }
      };

      fetchSchedule();
    }
  }, [isOpen, selectedDate]); // 依赖项改为 isOpen 和 selectedDate
  // ==================================================================
  
  // 条件返回语句现在位于所有 Hooks 之后
  if (!selectedDate) {
      return null; 
  }

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

  // 格式化日期为 YYYY-MM-DD 格式，适合做数据库的 Key
  const formatDateForKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    setIsSaving(true);

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formatDateForKey(selectedDate),
          meals: plannedMeals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the schedule.');
      }

      // 保存成功
      toast.success("菜单安排已保存！");
      onClose(); // 关闭模态框

    } catch (error) {
      console.error(error);
      toast.error("保存失败，请稍后再试。");
    } finally {
      setIsSaving(false);
    }
  };
  
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
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>取消</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "保存安排"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
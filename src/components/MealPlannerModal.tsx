// src/components/MealPlannerModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 定义组件接收的 props 类型
interface MealPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export default function MealPlannerModal({ isOpen, onClose, selectedDate }: MealPlannerModalProps) {
  if (!selectedDate) return null; // 如果没有日期，不渲染任何东西

  const formattedDate = selectedDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const MealSection = ({ title }: { title: string }) => (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="outline" size="sm">＋ 添加菜品</Button>
      </div>
      {/* 这里未来会显示已选择的菜品 */}
      <div className="mt-2 text-sm text-gray-500">
        暂无安排
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{formattedDate}</DialogTitle>
          <DialogDescription>
            为这一天计划好美味的三餐吧！
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <MealSection title="早餐 🥣" />
          <MealSection title="午餐 🍱" />
          <MealSection title="晚餐 🍝" />
        </div>

        <DialogFooter>
          <Button onClick={onClose}>关闭</Button>
          <Button type="submit">保存安排</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
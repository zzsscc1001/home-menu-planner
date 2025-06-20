// src/components/MenuView.tsx
'use client';

import { useState } from 'react';
import type { Dish } from '@/lib/types';
import DishDetailModal from '@/components/DishDetailModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface MenuViewProps {
  initialDishes: Dish[];
  dynamicDishIds: Set<string>; // 接收动态菜品ID集合
}

export default function MenuView({ initialDishes, dynamicDishIds }: MenuViewProps) {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDish(null);
  };

  const handleUpdateDish = (updatedDish: Dish) => {
    setDishes(prevDishes => 
      prevDishes.map(d => d.id === updatedDish.id ? updatedDish : d)
    );
  };

  const handleDeleteClick = (e: React.MouseEvent, dish: Dish) => {
    e.stopPropagation();
    setDishToDelete(dish);
  };

  const handleConfirmDelete = async () => {
    if (!dishToDelete) return;

    try {
      const response = await fetch('/api/menu/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dishToDelete.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete dish');
      }

      setDishes(prevDishes => prevDishes.filter(d => d.id !== dishToDelete.id));
      toast.success(`"${dishToDelete.name}" 已被删除。`);
    } catch {
      toast.error('删除失败，请稍后再试。');
    } finally {
      setDishToDelete(null);
    }
  };

  const categorizedDishes = dishes.reduce((acc, dish) => {
    const { category } = dish;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  const categories = ["菜", "汤", "主食"];

  return (
    <>
      <div className="space-y-10">
        {categories.map((category) => (
          categorizedDishes[category] && categorizedDishes[category].length > 0 && (
            <section key={category}>
              <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedDishes[category].map((dish) => {
                  const isDynamic = dynamicDishIds.has(dish.id);
                  return (
                    <div
                      key={dish.id}
                      className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                    >
                      <div 
                        className="cursor-pointer flex-grow"
                        onClick={() => handleDishClick(dish)}
                      >
                        <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {dish.tags?.map((tag) => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-end items-center gap-2 min-h-[40px]">
                        {isDynamic ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDishClick(dish)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              编辑
                            </Button>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleDeleteClick(e, dish)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="text-xs text-gray-400 italic">基础菜品</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )
        ))}
      </div>

      <DishDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        dish={selectedDish}
        onUpdate={handleUpdateDish}
      />

      <AlertDialog open={!!dishToDelete} onOpenChange={() => setDishToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>您确定要删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除菜品 “{dishToDelete?.name}” 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              确定删除
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
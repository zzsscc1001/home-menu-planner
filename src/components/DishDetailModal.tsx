// src/components/DishDetailModal.tsx
'use client';

import { useState } from 'react';
// 1. 从 ui/dialog 中导入 DialogDescription
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Dish } from '@/lib/types';
import DishForm from './DishForm';
import { toast } from 'sonner';

interface DishDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onUpdate: (updatedDish: Dish) => void;
}

export default function DishDetailModal({ isOpen, onClose, dish, onUpdate }: DishDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!dish) {
    return null;
  }

  const handleEditSubmit = async (data: Omit<Dish, 'id'> & { id?: string }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/menu/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update dish');
      }

      const updatedDish = await response.json();
      onUpdate(updatedDish);
      toast.success(`"${updatedDish.name}" 已成功更新！`);
      setIsEditing(false);
    } catch {
      toast.error('更新失败，请稍后再试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? `编辑: ${dish.name}` : dish.name}
          </DialogTitle>
          {/* 2. 在这里添加 DialogDescription */}
          <DialogDescription className="pt-1">
            {isEditing ? '修改菜品信息，完成后请点击保存。' : '在这里查看菜品的详细做法和标签。'}
          </DialogDescription>
          {!isEditing && (
            <div className="flex flex-wrap gap-2 pt-2">
              {dish.tags?.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </DialogHeader>
        
        {isEditing ? (
          <div className="py-4">
            <DishForm 
              initialData={dish} 
              onSubmit={handleEditSubmit} 
              isSubmitting={isSubmitting} 
            />
          </div>
        ) : (
          <>
            <div className="prose-styles py-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {dish.recipe}
              </ReactMarkdown>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(true)}>编辑</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
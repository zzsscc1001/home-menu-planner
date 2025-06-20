// src/components/DishDetailModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 用于支持表格等 GitHub 风格的 Markdown
import type { Dish } from '@/lib/types';

interface DishDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
}

export default function DishDetailModal({ isOpen, onClose, dish }: DishDetailModalProps) {
  // 如果没有选中的菜品，不渲染任何东西
  if (!dish) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2">{dish.name}</DialogTitle>
          <div className="flex flex-wrap gap-2">
            {dish.tags?.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </DialogHeader>
        {/* prose-styles 类用于美化 Markdown 输出 */}
        <div className="prose-styles py-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {dish.recipe}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}
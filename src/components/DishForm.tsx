// src/components/DishForm.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Dish } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DishFormProps {
  initialData?: Dish | null;
  onSubmit: (data: Omit<Dish, 'id'> & { id?: string }) => Promise<void>;
  isSubmitting: boolean;
}

// 辅助函数，用于生成表单的初始状态
const getInitialState = (data?: Dish | null) => ({
  name: data?.name || '',
  recipe: data?.recipe || '',
  category: data?.category || ('' as '菜' | '汤' | '主食' | ''),
  tags: data?.tags?.join(', ') || '',
});

export default function DishForm({ initialData, onSubmit, isSubmitting }: DishFormProps) {
  // --- 关键修复：直接在 useState 初始化时使用 props ---
  const [formData, setFormData] = useState(getInitialState(initialData));

  // 这个 useEffect 仍然有用，它能处理当 initialData 在组件已挂载后发生变化的情况
  useEffect(() => {
    // 当 initialData 变化时，重置表单状态
    setFormData(getInitialState(initialData));
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error('必须为菜品选择一个分类！');
      return;
    }

    const submissionData = {
      ...formData,
      category: formData.category as '菜' | '汤' | '主食',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      id: initialData?.id,
    };
    onSubmit(submissionData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: '菜' | '汤' | '主食') => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  // 如果 formData 还没有从 initialData 同步过来，可以显示一个加载状态或什么都不显示
  // 这可以防止在极少数情况下，initialData 延迟到达时显示空表单
  if (initialData && !formData.name) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="菜名" value={formData.name} onChange={handleInputChange} required />
      
      <Select 
        onValueChange={handleCategoryChange} 
        value={formData.category} // 现在这里的 value 在第一次渲染时就是正确的
      >
        <SelectTrigger>
          <SelectValue placeholder="请选择一个分类..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="菜">菜</SelectItem>
          <SelectItem value="汤">汤</SelectItem>
          <SelectItem value="主食">主食</SelectItem>
        </SelectContent>
      </Select>
      
      <Textarea name="recipe" placeholder="做法 (支持 Markdown)" value={formData.recipe} onChange={handleInputChange} rows={8} required />
      <Input name="tags" placeholder="标签 (用逗号分隔)" value={formData.tags} onChange={handleInputChange} />
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? '保存中...' : '保存'}
      </Button>
    </form>
  );
}
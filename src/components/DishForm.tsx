// src/components/DishForm.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Dish } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface DishFormProps {
  initialData?: Dish | null;
  onSubmit: (data: Omit<Dish, 'id'> & { id?: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function DishForm({ initialData, onSubmit, isSubmitting }: DishFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    recipe: '',
    category: '菜' as '菜' | '汤' | '主食',
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        recipe: initialData.recipe,
        category: initialData.category,
        tags: initialData.tags.join(', '),
      });
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="菜名" value={formData.name} onChange={handleInputChange} required />
      <Select onValueChange={handleCategoryChange} value={formData.category}>
        <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="菜">菜</SelectItem>
          <SelectItem value="汤">汤</SelectItem>
          <SelectItem value="主食">主食</SelectItem>
        </SelectContent>
      </Select>
      <Textarea name="recipe" placeholder="做法 (支持 Markdown)" value={formData.recipe} onChange={handleInputChange} rows={8} required />
      <Input name="tags" placeholder="标签 (用逗号分隔)" value={formData.tags} onChange={handleInputChange} />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? '保存中...' : '保存'}
      </Button>
    </form>
  );
}
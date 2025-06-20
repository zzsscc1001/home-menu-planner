// src/components/WishlistView.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { WishlistItem } from '@/lib/types';

// 为“添加新项目”表单的状态定义接口
interface NewItemState {
  name: string;
  recipe: string;
  category: '菜' | '汤' | '主食';
  tags: string;
}

export default function WishlistView() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newItem, setNewItem] = useState<NewItemState>({
    name: '',
    recipe: '',
    category: '菜',
    tags: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operatingItems, setOperatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setWishlist(data);
    } catch {
      toast.error('获取愿望单失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: '菜' | '汤' | '主食') => {
    setNewItem(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newItem.name || !newItem.recipe) {
      toast.error('菜名和做法不能为空');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newItem, 
          tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean) 
        }),
      });
      if (!response.ok) throw new Error('Failed to add item');
      
      const addedItem = await response.json();
      setWishlist(prev => [addedItem, ...prev]);
      setNewItem({ name: '', recipe: '', category: '菜', tags: '' });
      toast.success(`"${addedItem.name}" 已添加到愿望单！`);

    } catch {
      toast.error('添加失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: WishlistItem) => {
    if (operatingItems.has(item.id)) return;
  
    setOperatingItems(prev => new Set(prev).add(item.id));
    try {
      const response = await fetch(`/api/wishlist?id=${item.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete item');
      
      setWishlist(prev => prev.filter(w => w.id !== item.id));
      toast.success(`"${item.name}" 已从愿望单删除。`);

    } catch {
      toast.error('删除失败');
    } finally {
      setOperatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleApprove = async (item: WishlistItem) => {
    if (operatingItems.has(item.id)) return;
  
    setOperatingItems(prev => new Set(prev).add(item.id));
    try {
      const response = await fetch('/api/wishlist/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to approve item');
      
      const approvedDish = await response.json();
      setWishlist(prev => prev.filter(w => w.id !== item.id));
      toast.success(`"${approvedDish.name}" 已批准并加入主菜单！`);

    } catch {
      toast.error('批准失败');
    } finally {
      setOperatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">我的愿望单</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">添加新愿望</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="菜名" value={newItem.name} onChange={handleInputChange} required />
          <Select onValueChange={handleCategoryChange} value={newItem.category}>
            <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="菜">菜</SelectItem>
              <SelectItem value="汤">汤</SelectItem>
              <SelectItem value="主食">主食</SelectItem>
            </SelectContent>
          </Select>
          <Textarea name="recipe" placeholder="做法 (支持 Markdown)" value={newItem.recipe} onChange={handleInputChange} rows={5} required />
          <Input name="tags" placeholder="标签 (用逗号分隔, 如: 快手菜, 素食)" value={newItem.tags} onChange={handleInputChange} />
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? '添加中...' : '添加到愿望单'}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500 py-10">正在加载愿望单...</p>
        ) : wishlist.length > 0 ? (
          wishlist.map(item => {
            const isOperating = operatingItems.has(item.id);
            return (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{item.name} <span className="text-sm font-normal text-gray-500">- {item.category}</span></h3>
                  <p className="text-sm text-gray-600 mt-1 truncate max-w-md">{item.recipe.substring(0, 100)}...</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item)} disabled={isOperating}>
                    {isOperating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isOperating ? '' : '删除'}
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(item)} disabled={isOperating}>
                    {isOperating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isOperating ? '' : '批准'}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">你的愿望单是空的，快去添加一个吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
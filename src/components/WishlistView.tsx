// src/components/WishlistView.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// ... (Dish 和 WishlistItem 接口定义) ...

export default function WishlistView({ initialMenu }: { initialMenu: any[] }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', recipe: '', category: '菜', tags: '' });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
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
    if (!newItem.name || !newItem.recipe) {
      toast.error('菜名和做法不能为空');
      return;
    }
    
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!response.ok) throw new Error();
      const addedItem = await response.json();
      setWishlist(prev => [addedItem, ...prev]);
      setNewItem({ name: '', recipe: '', category: '菜', tags: '' });
      toast.success(`"${addedItem.name}" 已添加到愿望单！`);
    } catch (error) {
      toast.error('添加失败');
    }
  };

  const handleDelete = async (item: any) => {
    try {
      const response = await fetch(`/api/wishlist?id=${item.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setWishlist(prev => prev.filter(w => w.id !== item.id));
      toast.success(`"${item.name}" 已从愿望单删除。`);
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleApprove = async (item: any) => {
    try {
      const response = await fetch('/api/wishlist/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error();
      const approvedDish = await response.json();
      setWishlist(prev => prev.filter(w => w.id !== item.id));
      toast.success(`"${approvedDish.name}" 已批准并加入主菜单！`);
    } catch (error) {
      toast.error('批准失败');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">我的愿望单</h1>
      
      {/* 添加愿望的表单 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">添加新愿望</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="菜名" value={newItem.name} onChange={handleInputChange} required />
          <Select onValueChange={handleCategoryChange} defaultValue="菜">
            <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="菜">菜</SelectItem>
              <SelectItem value="汤">汤</SelectItem>
              <SelectItem value="主食">主食</SelectItem>
            </SelectContent>
          </Select>
          <Textarea name="recipe" placeholder="做法 (支持 Markdown)" value={newItem.recipe} onChange={handleInputChange} rows={5} required />
          <Input name="tags" placeholder="标签 (用逗号分隔, 如: 快手菜, 素食)" value={newItem.tags} onChange={handleInputChange} />
          <Button type="submit">添加到愿望单</Button>
        </form>
      </div>

      {/* 愿望单列表 */}
      <div className="space-y-4">
        {isLoading ? <p>加载中...</p> : wishlist.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{item.name} <span className="text-sm font-normal text-gray-500">- {item.category}</span></h3>
              <p className="text-sm text-gray-600 truncate">{item.recipe.substring(0, 100)}...</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleDelete(item)}>删除</Button>
              <Button size="sm" onClick={() => handleApprove(item)}>批准</Button>
            </div>
          </div>
        ))}
        {!isLoading && wishlist.length === 0 && <p>你的愿望单是空的，快添加一个吧！</p>}
      </div>
    </div>
  );
}
// src/app/menu/page.tsx
import { getFullMenu } from '@/lib/data';
import MenuView from '@/components/MenuView';

export default async function MenuPage() {
  // 1. 在服务器端获取数据
  const dishes = await getFullMenu();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-8">我们的菜单</h1>
      {/* 2. 将数据传递给客户端组件进行渲染和交互 */}
      <MenuView dishes={dishes} />
    </>
  );
}
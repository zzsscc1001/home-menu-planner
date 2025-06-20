// src/app/menu/page.tsx
import { getFullMenu } from '@/lib/data';
import MenuView from '@/components/MenuView';

export default async function MenuPage() {
  const { allDishes, dynamicDishIds } = await getFullMenu();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-8">我们的菜单</h1>
      <MenuView initialDishes={allDishes} dynamicDishIds={dynamicDishIds} />
    </>
  );
}
// src/app/menu/page.tsx
import { getFullMenu } from '@/lib/data'; // 导入新函数

// 定义菜品的数据类型，这得益于我们用了 TypeScript
interface Dish {
  id: string;
  name: string;
  category: string;
  recipe: string;
  tags: string[];
}

export default async function MenuPage() {
  // 1. 读取并处理数据
  const dishes = await getFullMenu(); // 调用新函数获取数据

  // 2. 按分类对菜品进行分组
  const categorizedDishes = dishes.reduce((acc, dish) => {
    const { category } = dish;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>); // {} as ... 是告诉 TS 初始值是一个空对象

  // 3. 定义分类的展示顺序
  const categories = ["菜", "汤", "主食"];

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-8">我们的菜单</h1>

      <div className="space-y-10">
        {categories.map((category) => (
          // ... 内部的 section 和 div 结构完全不变 ...
          <section key={category}>
            <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedDishes[category]?.map((dish) => ( // 加个 ?. 可选链更安全
                <div key={dish.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dish.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
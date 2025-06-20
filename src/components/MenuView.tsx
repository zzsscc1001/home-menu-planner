// src/components/MenuView.tsx
'use client';

import { useState } from 'react';
import type { Dish } from '@/lib/types';
import DishDetailModal from '@/components/DishDetailModal';

interface MenuViewProps {
  dishes: Dish[];
}

export default function MenuView({ dishes }: MenuViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDish(null);
  };

  // 按分类对菜品进行分组
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
          categorizedDishes[category] && (
            <section key={category}>
              <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedDishes[category].map((dish) => (
                  <button
                    key={dish.id}
                    onClick={() => handleDishClick(dish)}
                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dish.tags?.map((tag) => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )
        ))}
      </div>

      <DishDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dish={selectedDish}
      />
    </>
  );
}
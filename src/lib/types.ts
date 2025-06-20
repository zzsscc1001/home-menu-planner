// src/lib/types.ts

// 菜品的基础结构
export interface Dish {
    id: string;
    name: string;
    category: '菜' | '汤' | '主食';
    recipe: string;
    tags: string[];
  }
  
  // 愿望单项目的结构 (与 Dish 相同，但逻辑上分开)
  export interface WishlistItem extends Dish {}
  
  // 用于排期的菜品，可以简化，只需要 id 和 name
  export interface ScheduledDish {
    id: string;
    name: string;
  }
  
  // 每日三餐的排期结构
  export interface MealSchedule {
    breakfast: ScheduledDish[];
    lunch: ScheduledDish[];
    dinner: ScheduledDish[];
  }
// src/app/wishlist/page.tsx
// import { getFullMenu } from '@/lib/data'; // <--- 不再需要
import WishlistView from '@/components/WishlistView';

export default async function WishlistPage() {
  // const menu = await getFullMenu(); // <--- 不再需要
  return <WishlistView />; // <--- 修改这里
}
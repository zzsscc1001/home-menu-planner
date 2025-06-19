import { getFullMenu } from '@/lib/data';
import WishlistView from '@/components/WishlistView';

export default async function WishlistPage() {
  // 愿望单页面也可能需要完整的菜单信息，比如检查是否重名
  const menu = await getFullMenu();
  return <WishlistView initialMenu={menu} />;
}
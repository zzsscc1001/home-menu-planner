// src/app/wishlist/loading.tsx

const SkeletonWishlistItem = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
      <div className="flex-grow w-full">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
  
  export default function WishlistLoading() {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">我的愿望单</h1>
        
        {/* 模拟添加表单 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-4">
            <div className="h-9 bg-gray-200 rounded w-full"></div>
            <div className="h-9 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-9 bg-gray-200 rounded w-full"></div>
            <div className="h-9 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
  
        {/* 模拟愿望单列表 */}
        <div className="space-y-4">
          <SkeletonWishlistItem />
          <SkeletonWishlistItem />
          <SkeletonWishlistItem />
        </div>
      </div>
    );
  }
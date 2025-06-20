// src/app/menu/loading.tsx

// 这是一个骨架屏卡片组件，用于复用
const SkeletonCard = () => (
    <div className="bg-white border rounded-lg p-4 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-end items-center gap-2 min-h-[40px]">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded-full w-8"></div>
      </div>
    </div>
  );
  
  export default function MenuLoading() {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">我们的菜单</h1>
  
        {/* 模拟搜索和筛选区域 */}
        <div className="mb-8 p-4 bg-gray-50 border rounded-lg animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-9 bg-gray-200 rounded w-full"></div>
            </div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-28 mb-2"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
  
        {/* 模拟菜品分类和列表 */}
        <div className="space-y-10">
          {[1, 2, 3].map((i) => (
            <section key={i}>
              <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }
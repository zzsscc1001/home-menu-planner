// src/app/calendar/loading.tsx

export default function CalendarLoading() {
    return (
      <div>
        {/* 这里的标题和描述与 page.tsx 完全一致，所以不会跳动 */}
        <h1 className="text-3xl font-bold tracking-tight mb-4">排期日历</h1>
        <p className="text-gray-600 mb-8">点击一个未来的日期来安排您的三餐吧！</p>
        
        {/* 只有日历部分是骨架和动画 */}
        <div className="flex justify-center bg-white p-2 sm:p-4 rounded-lg shadow-sm border animate-pulse">
          <div className="p-3 w-[358px]">
            {/* 模拟日历头部 */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-28 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
            </div>
            
            {/* 模拟星期 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-6 w-full bg-gray-200 rounded-md"></div>
              ))}
            </div>
  
            {/* 模拟日期格子 */}
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
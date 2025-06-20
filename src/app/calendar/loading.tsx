// src/app/calendar/loading.tsx

export default function CalendarLoading() {
    return (
      <div>
        {/* 静态标题和描述 */}
        <h1 className="text-3xl font-bold tracking-tight mb-4">排期日历</h1>
        <p className="text-gray-600 mb-8">点击一个未来的日期来安排您的三餐吧！</p>
        
        {/* 
          这个 div 作为宽的白色背景板，并使用 flex justify-center。
          这与 CalendarView.tsx 的布局完全一致。
        */}
        <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-center animate-pulse">
          {/* 
            这个内部 div 模拟了日历内容的紧凑宽度。
            p-3 是为了匹配真实日历的内部 padding。
          */}
          <div className="p-3">
            {/* 模拟日历头部 */}
            <div className="flex items-center justify-between h-10 px-1 mb-2">
              <div className="h-9 w-9 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-28 bg-gray-200 rounded-md"></div>
              <div className="h-9 w-9 bg-gray-200 rounded-md"></div>
            </div>
            
            {/* 模拟星期 */}
            <div className="grid grid-cols-7 gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-9 w-9 flex items-center justify-center">
                  <div className="h-5 w-5 bg-gray-200 rounded-md"></div>
                </div>
              ))}
            </div>
  
            {/* 模拟日期格子 */}
            <div className="grid grid-cols-7 gap-1.5 mt-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-9 w-9 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
// src/components/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // 使用 pathname 作为 key，是触发动画的关键
        initial={{ opacity: 0, y: 15 }} // 初始状态：透明，稍微向下偏移
        animate={{ opacity: 1, y: 0 }}   // 进入状态：完全不透明，回到原位
        exit={{ opacity: 0, y: 15 }}     // 离开状态：透明，稍微向下偏移
        transition={{ duration: 0.25, ease: 'easeInOut' }} // 动画持续时间和缓动效果
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
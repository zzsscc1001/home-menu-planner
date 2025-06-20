# 🍽️ Home Menu Planner | 家庭菜单规划师

一个现代、美观且功能强大的家庭菜单规划 Web 应用，旨在解决“今天吃什么？”这个永恒的难题。它允许用户管理自己的菜谱，创建愿望单，并在日历上轻松安排未来两周的三餐。

![项目截图](https://raw.githubusercontent.com/zzsscc1001/home-menu-planner/main/public/demo.png)
*(提示: 您可以将项目截图命名为 `demo.png` 并放在 `/public` 目录下，然后这里的图片就能正常显示了。)*

## ✨ 核心功能

-   **菜单管理**:
    -   按“菜”、“汤”、“主食”分类展示所有菜品。
    -   支持 Markdown 语法的菜谱展示，做法一目了然。
    -   强大的搜索和标签筛选功能，快速找到目标菜品。
    -   完整的 **CRUD** 操作：可以对动态添加的菜品进行**编辑**和**删除**。

-   **愿望单系统**:
    -   轻松添加想吃的菜到愿望单。
    -   管理员可以一键**批准**愿望单中的菜品，使其正式加入主菜单。

-   **智能日历排期**:
    -   在真实日历上为未来14天计划早、午、晚餐。
    -   已排期的日期会有清晰的视觉标记。
    -   对主菜单的编辑和删除操作会**自动同步**到日历排期中，保证数据一致性。

-   **随机推荐**:
    -   首页提供“手气不错”功能，随机推荐一道菜品，解决您的选择困难症。

-   **卓越的用户体验**:
    -   **移动端优先**设计，底部 Tab Bar 导航，完美适配手机操作。
    -   所有数据加载均有**骨架屏 (Skeleton Screen)** 过渡，告别白屏和卡顿感。
    -   流畅的**页面切换动画**，提升应用的精致感。
    -   所有操作均有 Toast 通知，提供即时反馈。

## 🚀 技术栈

-   **框架**: [Next.js](https://nextjs.org/) (App Router)
-   **UI 库**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
-   **数据库**: [Vercel KV](https://vercel.com/storage/kv) (基于 Upstash Redis)
-   **动画**: [Framer Motion](https://www.framer.com/motion/)
-   **图标**: [Lucide React](https://lucide.dev/)
-   **Markdown 渲染**: `react-markdown`
-   **部署**: [Vercel](https://vercel.com/)
-   **语言**: TypeScript

## ⚙️ 本地开发与运行

按照以下步骤，您可以在本地环境中轻松运行此项目。

**1. 克隆仓库**

```bash
git clone https://github.com/zzsscc1001/home-menu-planner.git
cd home-menu-planner
Use code with caution.
Markdown
2. 安装依赖
Generated bash
npm install
Use code with caution.
Bash
3. 配置环境变量
本项目使用 Vercel KV 作为数据库。您需要从您的 Vercel 项目中获取环境变量。
首先，复制 .env.example 文件并重命名为 .env.local：
Generated bash
cp .env.example .env.local
Use code with caution.
Bash
然后，将以下内容粘贴到 .env.local 文件中，并填入您在 Vercel 项目 KV 数据库中获取的真实值。
Generated env
# .env.local

# 从 Vercel 项目的 Settings -> Environment Variables 中获取
# 这些变量用于连接到 Vercel KV (Upstash Redis)
KV_URL="YOUR_KV_URL"
KV_REST_API_URL="YOUR_KV_REST_API_URL"
KV_REST_API_TOKEN="YOUR_KV_REST_API_TOKEN"
KV_REST_API_READ_ONLY_TOKEN="YOUR_KV_REST_API_READ_ONLY_TOKEN"

# 最好也加上这些，@upstash/redis 会优先使用它们
UPSTASH_REDIS_REST_URL="YOUR_KV_REST_API_URL"
UPSTASH_REDIS_REST_TOKEN="YOUR_KV_REST_API_TOKEN"
Use code with caution.
Env
(提示: 您可以在 Vercel 项目仪表盘中，找到对应的 KV 存储，点击 "Connect" 或 ".env" 按钮来查看这些值。)
4. 运行开发服务器
Generated bash
npm run dev
Use code with caution.
Bash
现在，在浏览器中打开 http://localhost:3000 即可看到正在运行的应用。
部署
该项目已为 Vercel 平台进行了优化。只需将您的 GitHub 仓库连接到 Vercel，并确保在 Vercel 项目设置中配置了与 .env.local 相同的环境变量，即可实现一键部署和自动更新。
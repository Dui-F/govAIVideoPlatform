# 政府AI视频制作平台

专为央视、国家电网等政府平台打造的AI视频制作系统。

## 功能模块

### 前端页面 (Port 3000)
- **AI视频制作**: 生成脚本内容、选择画风、批量出图、批量生视频
- **AI视频学习**: 上传视频文件，分析画风，提取提示词
- **人工审核**: 审核生成的图片和视频，支持重新生成

### 后台管理系统 (Port 3001)
- **仪表盘**: 系统概览和统计数据
- **画风管理**: 增删改查画风模板
- **提示词管理**: 增删改查提示词模板
- **用户管理**: 管理用户和权限

## 技术栈

- **前端**: Next.js 14, React 18, Tailwind CSS, Zustand
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **AI服务**: 即梦API (图片/视频生成)
- **部署**: Docker / Vercel

## 项目结构

```
govAIVideoPlatform/
├── apps/
│   ├── web/          # 前端页面
│   └── admin/        # 后台管理系统
├── packages/
│   ├── database/     # 数据库类型和连接
│   ├── shared/       # 共享工具和类型
│   └── api/          # 即梦API集成
├── supabase/
│   └── schema.sql    # 数据库结构
└── docker-compose.yml
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写配置:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JIMENG_API_KEY=your_jimeng_api_key
JIMENG_API_BASE_URL=https://api.jimeng.ai
```

### 3. 初始化数据库

在 Supabase 控制台执行 `supabase/schema.sql` 中的SQL脚本。

### 4. 启动开发服务器

```bash
# 同时启动前端和后台
npm run dev

# 或分别启动
npm run dev:web    # 前端 http://localhost:3000
npm run dev:admin  # 后台 http://localhost:3001
```

## 部署

### Docker 部署

```bash
docker-compose up -d
```

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 部署

## API 文档

### 认证
- `GET /api/auth` - 获取当前用户信息

### 画风
- `GET /api/styles` - 获取画风列表

### 提示词
- `GET /api/prompts` - 获取提示词列表
- `GET /api/prompts?category=style` - 按分类筛选

### 项目
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建新项目

### 图片
- `GET /api/images` - 获取图片列表
- `POST /api/images` - 创建图片生成任务
- `PATCH /api/images` - 更新图片状态（审核）

### 视频
- `GET /api/videos` - 获取视频列表
- `POST /api/videos` - 创建视频生成任务
- `PATCH /api/videos` - 更新视频状态（审核）

### 学习
- `GET /api/learn` - 获取学习记录
- `POST /api/learn` - 创建学习任务
- `PATCH /api/learn` - 更新学习结果

## 用户角色

- **admin**: 管理员，拥有所有权限
- **reviewer**: 审核员，可以审核图片和视频
- **user**: 普通用户，可以创建项目和使用功能

## 许可证

内部使用，仅供政府平台授权用户使用。

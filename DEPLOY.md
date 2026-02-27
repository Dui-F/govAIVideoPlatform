# 政府AI视频制作平台 - 部署指南

## 账号信息

### 管理员账号
- 邮箱: `admin@gov.cn`
- 密码: `admin123`

### 合伙人账号
- 邮箱: `partner@gov.cn`
- 密码: `partner123`

---

## 部署步骤

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/govAIVideoPlatform.git
git push -u origin main
```

### 2. 部署前端

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. **Root Directory 设置为**: `apps/web`
5. **Environment Variables** (从 Supabase Dashboard 获取):
   - `NEXT_PUBLIC_SUPABASE_URL` - 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 你的 Supabase Anon Key
   - `NEXT_PUBLIC_APP_URL` - 前端域名
   - `NEXT_PUBLIC_ADMIN_URL` - 后台域名
6. 点击 Deploy

### 3. 部署后台

1. 再次点击 "New Project"
2. 导入同一个 GitHub 仓库
3. **Root Directory 设置为**: `apps/admin`
4. **Environment Variables** (从 Supabase Dashboard 获取):
   - `NEXT_PUBLIC_SUPABASE_URL` - 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 你的 Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY` - 你的 Supabase Service Role Key (保密!)
   - `NEXT_PUBLIC_APP_URL` - 前端域名
   - `NEXT_PUBLIC_ADMIN_URL` - 后台域名
5. 点击 Deploy

### 4. 配置 Supabase 允许的域名

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入项目 → Authentication → URL Configuration
3. 添加你的域名到:
   - Site URL
   - Redirect URLs

---

## 项目结构

```
govAIVideoPlatform/
├── apps/
│   ├── web/          # 前端用户页面 (端口 3000)
│   └── admin/        # 后台管理系统 (端口 3001)
├── packages/
│   ├── database/     # 数据库类型定义
│   ├── shared/       # 共享工具
│   └── api/          # 即梦API集成
└── supabase/
    └── schema.sql    # 数据库结构
```

## 本地开发

```bash
npm install
npm run dev
```

- 前端: http://localhost:3000
- 后台: http://localhost:3001

## 安全提示

⚠️ **永远不要将以下内容提交到 Git 仓库：**
- `.env` 或 `.env.local` 文件
- Supabase Service Role Key
- 任何 API 密钥或密码

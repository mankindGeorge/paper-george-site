# Mankind George 纪事报

报纸风格的个人作品集网站，采用 NestJS + Nuxt 3 + Prisma + PostgreSQL 技术栈。

## 技术栈

- **后端:** NestJS 10, Prisma 5.9, PostgreSQL, JWT 认证, 邮件通知
- **前端:** Nuxt 3, Vue 3, Tailwind CSS 3.4, markdown-it
- **部署:** Docker + Docker Compose

## 项目结构

```
paper-george-site/
├── backend/                 # NestJS 后端
│   ├── src/
│   │   ├── auth/           # JWT 认证模块
│   │   ├── experiences/    # 经历管理 CRUD
│   │   ├── projects/       # 项目管理 CRUD
│   │   ├── scraps/         # 剪报管理 CRUD
│   │   ├── messages/       # 留言管理
│   │   ├── mail/           # 邮件通知
│   │   └── health/         # 健康检查
│   ├── prisma/             # 数据库 schema 和 seed
│   └── Dockerfile
├── frontend/               # Nuxt 3 前端
│   ├── components/         # UI 组件
│   ├── composables/        # useApi, useAuth
│   ├── layouts/            # default, admin
│   ├── pages/              # 页面路由
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 环境要求

- Node.js >= 18
- PostgreSQL >= 14
- npm

## 快速开始

### 1. 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env`，填入实际的配置：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mankind_george"
JWT_SECRET="你的JWT密钥"          # 必须修改，不要使用默认值
JWT_EXPIRATION="7d"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"          # 建议修改
PORT=3001
FRONTEND_URL="http://localhost:3000"

SMTP_HOST="smtp.example.com"       # 配置邮件服务
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
SMTP_FROM="noreply@example.com"
```

前端环境变量（`frontend/.env`）通常不需要修改：

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

### 2. 初始化数据库

```bash
# 创建 PostgreSQL 数据库
createdb mankind_george

# 运行数据库迁移
cd backend
npm install
npx prisma generate
npx prisma migrate dev

# 填充初始数据
npm run prisma:seed
```

### 3. 启动后端

```bash
cd backend
npm install          # 首次运行时
npm run start:dev    # 开发模式（热重载）
```

后端默认运行在 `http://localhost:3001`。

### 4. 启动前端

```bash
cd frontend
npm install          # 首次运行时
npm run dev          # 开发模式
```

前端默认运行在 `http://localhost:3000`。

### 5. 访问网站

- **前台:** http://localhost:3000
- **管理后台:** http://localhost:3000/admin
- **健康检查:** http://localhost:3001/api/health

默认管理员账号：`admin` / `admin123`

## Docker 部署

一键启动所有服务：

```bash
# 创建环境变量文件
cp backend/.env.example .env
# 编辑 .env 填入配置

# 启动
docker-compose up -d

# 初始化数据库（首次启动）
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
```

Docker 服务说明：
- `postgres-db`: PostgreSQL 数据库（端口 5433）
- `backend`: NestJS API 服务（端口 3001）
- `frontend`: Nuxt 前端（端口 3000）

## API 接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 登录 | 无 |
| GET | `/api/experiences` | 获取已发布经历 | 无 |
| GET | `/api/experiences?admin=true` | 获取所有经历 | 需要 |
| GET | `/api/experiences/:columnType` | 按栏目获取经历 | 无 |
| POST | `/api/experiences` | 创建经历 | 需要 |
| PUT | `/api/experiences/:id` | 更新经历 | 需要 |
| DELETE | `/api/experiences/:id` | 删除经历 | 需要 |
| GET | `/api/projects` | 获取所有项目 | 无 |
| POST | `/api/projects` | 创建项目 | 需要 |
| PUT | `/api/projects/:id` | 更新项目 | 需要 |
| DELETE | `/api/projects/:id` | 删除项目 | 需要 |
| GET | `/api/scraps` | 获取所有剪报 | 无 |
| POST | `/api/scraps` | 创建剪报 | 需要 |
| PUT | `/api/scraps/:id` | 更新剪报 | 需要 |
| DELETE | `/api/scraps/:id` | 删除剪报 | 需要 |
| POST | `/api/messages` | 提交留言 | 无 |
| GET | `/api/messages` | 获取所有留言 | 需要 |
| PUT | `/api/messages/:id/read` | 标记已读 | 需要 |
| GET | `/api/health` | 健康检查 | 无 |

## 常用命令

```bash
# 后端
npm run start:dev       # 开发模式
npm run build           # 构建
npm run start:prod      # 生产模式
npm run prisma:generate # 重新生成 Prisma Client
npm run prisma:migrate  # 运行数据库迁移
npm run prisma:seed     # 填充初始数据

# 前端
npm run dev             # 开发模式
npm run build           # 构建生产版本
npm run preview         # 预览构建结果
```

# Mankind George 纪事报

报纸风格的个人作品集网站，采用 NestJS + Nuxt 3 + Prisma + PostgreSQL 技术栈。

## 技术栈

- **后端:** NestJS 10, Prisma 5.9, PostgreSQL, JWT 认证, 邮件通知
- **前端:** Nuxt 3, Vue 3, Tailwind CSS 3.4, markdown-it
- **部署:** Docker / Linux 原生部署

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
│   │   ├── uploads/        # 图片上传
│   │   ├── settings/       # 站点配置
│   │   ├── mail/           # 邮件通知
│   │   └── health/         # 健康检查
│   ├── prisma/             # 数据库 schema 和 seed
│   └── uploads/            # 上传文件存储目录
├── frontend/               # Nuxt 3 前端
│   ├── components/         # UI 组件
│   ├── composables/        # useApi, useAuth
│   ├── layouts/            # default, admin
│   └── pages/              # 页面路由
├── docker-compose.yml
├── nginx.conf              # Docker 反代配置
├── nginx.node.conf         # Linux 原生部署反代配置
└── README.md
```

***

## Docker 部署（推荐）

一键启动所有服务：

```bash
# 1. 创建环境变量文件
cp backend/.env.example .env
# 编辑 .env 填入配置（JWT_SECRET、SMTP 等）

# 2. 创建 SSL 证书目录（HTTPS 需要）
mkdir -p ssl
# 将证书放入 ssl/cert.pem 和 ssl/key.pem
# 自签名测试证书：openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem

# 3. 启动
docker-compose up -d

# 4. 初始化数据库（首次启动）
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
```

Docker 服务说明：

- `nginx`: Nginx 反向代理（端口 80/443）
- `frontend`: Nuxt 前端（内部端口 3000）
- `backend`: NestJS API 服务（内部端口 3001）
- `postgres-db`: PostgreSQL 数据库

### 更改端口

修改 `docker-compose.yml` 中 nginx 的端口映射：

```yaml
nginx:
  ports:
    - "8080:80"     # 改为 8080
    - "8443:443"    # 改为 8443
```

如需 HTTPS，将证书放入 `ssl/` 目录，Nginx 会自动加载 `ssl/cert.pem` 和 `ssl/key.pem`。

***

## Linux 原生部署（备选）

> 仅在无法安装 Docker 的服务器上使用此方案。需要手动安装和配置所有依赖。

### 1. 系统要求

| 组件         | 最低版本    | 说明          |
| ---------- | ------- | ----------- |
| Node.js    | >= 18.x | 推荐 20.x LTS |
| PostgreSQL | >= 14   | 数据库         |
| Nginx      | >= 1.18 | 反向代理        |
| npm        | >= 9    | 包管理器        |
| PM2        | latest  | 进程管理（推荐）    |

### 2. 安装系统依赖

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y curl git build-essential

# 安装 Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 确认版本
node -v   # 应输出 v20.x.x
npm -v    # 应输出 10.x.x

# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-client

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2（全局）
sudo npm install -g pm2
```

### 3. 配置 PostgreSQL

```bash
# 启动 PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户创建数据库
sudo -u postgres psql

# 在 psql 中执行：
CREATE DATABASE mankind_george;
ALTER USER postgres WITH PASSWORD 'your_password';
\q
```

编辑 PostgreSQL 认证配置（如需密码登录）：

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

确保有以下行（允许本地密码登录）：

```
local   all   postgres   md5
host    all   all        127.0.0.1/32   md5
```

重启 PostgreSQL：

```bash
sudo systemctl restart postgresql
```

### 4. 克隆项目

```bash
cd /opt
sudo git clone https://github.com/mankindGeorge/paper-george-site.git
sudo chown -R $USER:$USER /opt/paper-george-site
cd /opt/paper-george-site
```

### 5. 配置后端环境变量

```bash
cd backend
cp .env.example .env  # 如果没有 .env.example，手动创建
nano .env
```

写入以下内容（**必须修改**标 `⚠` 的项）：

```env
# ⚠ 数据库连接（修改密码为你设置的 PostgreSQL 密码）
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mankind_george"

# ⚠ JWT 密钥（必须修改，使用随机字符串）
JWT_SECRET="your-random-secret-key-here-at-least-32-chars"
JWT_EXPIRATION="7d"

# ⚠ 管理员密码（建议修改）
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-admin-password"

# 后端端口
PORT=3001

# ⚠ 前端访问地址（如果有域名填域名，否则用服务器 IP）
FRONTEND_URL="http://your-server-ip"

# 邮件通知（可选，不配置则不发送邮件）
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"
SMTP_FROM="noreply@example.com"
```

### 6. 安装后端依赖并构建

```bash
cd /opt/paper-george-site/backend

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy
# npx prisma migrate reset --force

# 填充初始数据（种子数据）
npm run prisma:seed

# 创建 uploads 目录
mkdir -p uploads

# 构建生产版本
npm run build
```

### 7. 配置前端环境变量

```bash
cd /opt/paper-george-site/frontend

nano .env
```

写入：

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

### 8. 安装前端依赖并构建

```bash
cd /opt/paper-george-site/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，前端产物在 `.output/` 目录。

### 9. 用 PM2 启动服务

```bash
cd /opt/paper-george-site

# 启动后端
pm2 start backend/dist/main.js --name "paper-backend" --env production

# 启动前端（使用 Nuxt 的 Nitro 服务器）
pm2 start frontend/.output/server/index.mjs --name "paper-frontend" --env production

# 保存进程列表（开机自启）
pm2 save

# 设置开机自启
pm2 startup
# 按照输出的命令执行（通常是 sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME）
```

### 10. 配置 Nginx 反向代理

```bash
sudo nano /etc/nginx/sites-available/paper-george
```

写入以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器 IP

    # 前端（Nuxt SSR）
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置并重启 Nginx：

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/paper-george /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 11. 配置防火墙

```bash
# UFW（Ubuntu/Debian）
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# 或者 firewalld（CentOS/RHEL）
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 12. 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（会自动修改 Nginx 配置）
sudo certbot --nginx -d your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

### 13. 访问验证

- **前台:** <http://your-server-ip>
- **管理后台:** <http://your-server-ip/admin>
- **健康检查:** <http://your-server-ip/api/health>
- **默认管理员:** `admin` / `admin123`（记得修改）

### 14. 常用运维命令

```bash
# PM2 进程管理
pm2 list                    # 查看所有进程状态
pm2 logs paper-backend      # 查看后端日志
pm2 logs paper-frontend     # 查看前端日志
pm2 restart paper-backend   # 重启后端
pm2 restart paper-frontend  # 重启前端
pm2 stop paper-backend      # 停止后端
pm2 delete paper-backend    # 删除进程

# 更新代码后重新部署
cd /opt/paper-george-site
git pull
cd backend && npm install && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..
pm2 restart paper-backend paper-frontend

# 数据库迁移（更新后）
cd /opt/paper-george-site/backend
npx prisma migrate deploy
npm run prisma:seed  # 仅在需要重新填充时执行

# 查看端口占用
sudo netstat -tlnp | grep -E '3000|3001|80|443'
```

### 15. 故障排查

| 问题                 | 排查方法                                                           |
| ------------------ | -------------------------------------------------------------- |
| 前端 502 Bad Gateway | `pm2 list` 确认进程运行中；`pm2 logs` 查看错误                             |
| 后端 API 404         | 检查 `pm2 logs paper-backend`；确认 `npx prisma migrate deploy` 已执行 |
| 数据库连接失败            | `sudo systemctl status postgresql`；检查 `DATABASE_URL` 密码        |
| 图片上传后 404          | 确认 `backend/uploads/` 目录存在且有写入权限                               |
| CORS 错误            | 检查后端 `.env` 的 `FRONTEND_URL` 是否匹配访问地址                          |
| Nginx 502          | `sudo nginx -t` 测试配置；`sudo tail -f /var/log/nginx/error.log`   |
| PM2 进程崩溃           | `pm2 logs` 查看错误；`pm2 restart` 重启                               |

### 端口说明

| 端口   | 服务         | 说明                   |
| ---- | ---------- | -------------------- |
| 80   | Nginx      | HTTP 入口（用户访问）        |
| 443  | Nginx      | HTTPS 入口（配置证书后）      |
| 3000 | Nuxt       | 前端 SSR 服务器（Nginx 代理） |
| 3001 | NestJS     | 后端 API 服务器（Nginx 代理） |
| 5432 | PostgreSQL | 数据库                  |

***

## API 接口

| 方法     | 路径                             | 说明      | 认证 |
| ------ | ------------------------------ | ------- | -- |
| POST   | `/api/auth/login`              | 登录      | 无  |
| GET    | `/api/experiences`             | 获取已发布经历 | 无  |
| GET    | `/api/experiences?admin=true`  | 获取所有经历  | 需要 |
| GET    | `/api/experiences/:columnType` | 按栏目获取经历 | 无  |
| POST   | `/api/experiences`             | 创建经历    | 需要 |
| PUT    | `/api/experiences/:id`         | 更新经历    | 需要 |
| DELETE | `/api/experiences/:id`         | 删除经历    | 需要 |
| GET    | `/api/projects`                | 获取所有项目  | 无  |
| POST   | `/api/projects`                | 创建项目    | 需要 |
| PUT    | `/api/projects/:id`            | 更新项目    | 需要 |
| DELETE | `/api/projects/:id`            | 删除项目    | 需要 |
| GET    | `/api/scraps`                  | 获取所有剪报  | 无  |
| POST   | `/api/scraps`                  | 创建剪报    | 需要 |
| PUT    | `/api/scraps/:id`              | 更新剪报    | 需要 |
| DELETE | `/api/scraps/:id`              | 删除剪报    | 需要 |
| POST   | `/api/messages`                | 提交留言    | 无  |
| GET    | `/api/messages`                | 获取所有留言  | 需要 |
| PUT    | `/api/messages/:id/read`       | 标记已读    | 需要 |
| GET    | `/api/health`                  | 健康检查    | 无  |

## 构建命令

```bash
# 后端
npm run build           # 构建生产版本
npm run start:prod      # 运行生产版本
npm run prisma:generate # 重新生成 Prisma Client
npm run prisma:migrate  # 运行数据库迁移
npm run prisma:seed     # 填充初始数据

# 前端
npm run build           # 构建生产版本
```


# 🚀 部署指南 - Scientific Calculator

## 📋 目录

1. [部署前准备](#部署前准备)
2. [部署方式](#部署方式)
3. [环境变量配置](#环境变量配置)
4. [服务器部署](#服务器部署)
5. [Docker 部署](#docker-部署)
6. [部署后验证](#部署后验证)
7. [常见问题](#常见问题)

---

## 🎯 部署前准备

### 1. 检查项目完整性

```bash
# 确保所有依赖已安装
npm install

# 运行测试（如果有）
npm test

# 构建项目
npm run build
```

### 2. 必需文件清单

- [x] `.next/` - 构建输出目录
- [x] `public/` - 静态资源
- [x] `package.json` - 依赖配置
- [x] `next.config.js` - Next.js 配置
- [ ] `public/icon.png` - ⚠️ 需要创建
- [ ] `public/icon-512.png` - ⚠️ 需要创建
- [ ] `public/og-image.png` - ⚠️ 需要创建
- [ ] `.env.production` - 生产环境变量（可选）

### 3. SEO 资源准备

**重要**: 在部署前创建以下图标文件（放在 `public/` 目录）：

```bash
# 需要的图标文件
public/
├── icon.png          # 192x192px
├── icon-512.png      # 512x512px
├── apple-icon.png    # 180x180px
└── og-image.png      # 1200x630px
```

参考：`public/ICONS_README.md` 获取创建指南

### 4. 更新域名配置

在以下文件中将 `scientific-calculator.app` 替换为你的实际域名：

```bash
# 需要更新的文件
- app/layout.tsx (metadataBase, openGraph.url)
- app/page.tsx (structuredData.url)
- app/robots.ts (sitemap URL)
- app/sitemap.ts (baseUrl)
```

---

## 🌐 部署方式

### 方式 1: Vercel（推荐 - 最简单）

**Vercel 是 Next.js 的官方部署平台，零配置部署**

#### 步骤：

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd f:\workspace\demo02\newProduct
vercel
```

4. **跟随提示：**
- Setup and deploy? **Y**
- Which scope? 选择你的账号
- Link to existing project? **N**
- Project name? **scientific-calculator**
- Directory? **./newProduct** 或 **./**
- Override settings? **N**

5. **生产部署**
```bash
vercel --prod
```

#### 优点：
- ✅ 零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动构建和部署
- ✅ 免费套餐

#### 部署后：
```
✅ Production: https://scientific-calculator.vercel.app
```

---

### 方式 2: 传统服务器部署（Node.js）

**适合：VPS、云服务器（阿里云、腾讯云、AWS EC2）**

#### 前置要求：
- Node.js 18+ 已安装
- PM2（进程管理器）

#### 步骤：

1. **在服务器上安装 Node.js**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

2. **安装 PM2**
```bash
npm install -g pm2
```

3. **上传项目文件**

使用 FTP/SFTP 或 Git 上传以下文件到服务器：
```bash
# 方法 A: 使用 Git
git clone <your-repo-url>
cd scientific-calculator

# 方法 B: 使用 SCP
scp -r newProduct/ user@server:/var/www/calculator/
```

4. **在服务器上构建**
```bash
cd /var/www/calculator
npm install --production
npm run build
```

5. **使用 PM2 启动**
```bash
# 启动应用
pm2 start npm --name "calculator" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs calculator
```

6. **配置 Nginx 反向代理**
```nginx
# /etc/nginx/sites-available/calculator
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/calculator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **配置 HTTPS（使用 Let's Encrypt）**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### 方式 3: Docker 部署

**适合：容器化部署、Kubernetes**

#### 1. 创建 Dockerfile

在 `newProduct/` 目录创建 `Dockerfile`：

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. 更新 next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 添加这一行
}

module.exports = nextConfig
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t scientific-calculator .

# 运行容器
docker run -p 3000:3000 scientific-calculator

# 或使用 docker-compose
docker-compose up -d
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  calculator:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

---

### 方式 4: 静态导出部署

**适合：Nginx、Apache、GitHub Pages**

#### 1. 配置静态导出

更新 `next.config.js`：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

#### 2. 构建静态文件

```bash
npm run build
```

输出目录：`out/`

#### 3. 部署到静态服务器

```bash
# 上传 out/ 目录到服务器
scp -r out/* user@server:/var/www/html/

# 或配置 Nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/calculator/out;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔑 环境变量配置

### 创建 `.env.production`

```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
```

### 在 Vercel 中配置

```bash
vercel env add NEXT_PUBLIC_APP_URL production
# 输入: https://your-domain.com
```

---

## 🖥️ 服务器部署详细步骤

### 完整的生产环境部署

```bash
# 1. 连接到服务器
ssh user@your-server-ip

# 2. 安装必要软件
sudo apt update
sudo apt install -y nginx nodejs npm git

# 3. 创建项目目录
sudo mkdir -p /var/www/calculator
sudo chown -R $USER:$USER /var/www/calculator

# 4. 克隆或上传项目
cd /var/www/calculator
git clone <your-repo> .
# 或使用 SCP 上传文件

# 5. 安装依赖和构建
cd newProduct
npm install
npm run build

# 6. 安装 PM2 并启动
npm install -g pm2
pm2 start npm --name "calculator" -- start
pm2 startup
pm2 save

# 7. 配置 Nginx（见上文）

# 8. 配置防火墙
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# 9. 配置 HTTPS（Let's Encrypt）
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 10. 完成！
echo "✅ 部署完成！访问: https://your-domain.com"
```

---

## ✅ 部署后验证

### 1. 功能测试

- [ ] 主页加载正常
- [ ] 计算器功能正常（测试 2+3=5）
- [ ] 科学函数正常（sin, cos, log）
- [ ] 模式切换正常（Deg/Rad）
- [ ] 键盘输入正常
- [ ] 移动端适配正常

### 2. SEO 检查

```bash
# 检查 meta 标签
curl https://your-domain.com | grep -i "meta"

# 检查 robots.txt
curl https://your-domain.com/robots.txt

# 检查 sitemap
curl https://your-domain.com/sitemap.xml

# 检查 manifest
curl https://your-domain.com/manifest.json
```

### 3. 性能测试

- **Lighthouse 审计**（Chrome DevTools）
  - Performance: > 85
  - SEO: > 90
  - Accessibility: > 85
  - Best Practices: > 90

- **PageSpeed Insights**
  - 访问: https://pagespeed.web.dev/
  - 输入你的域名

### 4. HTTPS 验证

- [ ] HTTPS 正常访问
- [ ] HTTP 自动重定向到 HTTPS
- [ ] SSL 证书有效

---

## 🔧 常见问题

### Q1: 打包时出现 EPERM 错误？

**解决方案**：
```bash
# 停止所有 Node 进程
taskkill /F /IM node.exe

# 删除 .next 目录
rm -rf .next

# 重新构建
npm run build
```

### Q2: 部署后页面空白？

**检查项**：
1. 确保 `npm run build` 成功
2. 检查服务器日志：`pm2 logs calculator`
3. 检查 Nginx 配置是否正确
4. 确保端口 3000 没有被占用

### Q3: 图标不显示？

**原因**：图标文件未创建

**解决**：
1. 创建所需的图标文件（见 `public/ICONS_README.md`）
2. 上传到 `public/` 目录
3. 重新部署

### Q4: sitemap.xml 404？

**检查**：
```bash
# 确保 app/sitemap.ts 存在
ls -la app/sitemap.ts

# 重新构建
npm run build
```

### Q5: 如何更新部署？

**Vercel**：
```bash
git push  # Vercel 会自动部署
# 或
vercel --prod
```

**服务器**：
```bash
cd /var/www/calculator/newProduct
git pull
npm install
npm run build
pm2 restart calculator
```

### Q6: 内存不足？

**优化**：
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS=--max_old_space_size=4096 npm run build

# PM2 配置
pm2 start npm --name "calculator" --max-memory-restart 500M -- start
```

---

## 📊 监控和维护

### 使用 PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs calculator

# 查看资源使用
pm2 monit

# 重启应用
pm2 restart calculator

# 停止应用
pm2 stop calculator
```

### 日志管理

```bash
# 配置日志轮转
pm2 install pm2-logrotate

# 设置日志大小限制
pm2 set pm2-logrotate:max_size 10M
```

### 自动备份

```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/calculator_$DATE.tar.gz /var/www/calculator
find /backup -name "calculator_*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# 添加到 crontab（每天凌晨 2 点备份）
crontab -e
# 添加: 0 2 * * * /path/to/backup.sh
```

---

## 🔗 有用的资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 文档](https://vercel.com/docs)
- [PM2 文档](https://pm2.keymetrics.io/)
- [Nginx 配置](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## 📝 部署检查清单

### 部署前
- [ ] 代码构建成功（`npm run build`）
- [ ] 所有测试通过（`npm test`）
- [ ] 创建所有必需的图标文件
- [ ] 更新所有域名配置
- [ ] 配置环境变量
- [ ] 准备服务器或选择部署平台

### 部署中
- [ ] 上传所有文件
- [ ] 安装依赖
- [ ] 构建项目
- [ ] 配置进程管理器（PM2）
- [ ] 配置 Web 服务器（Nginx）
- [ ] 配置 HTTPS

### 部署后
- [ ] 验证功能正常
- [ ] 检查 SEO 元素
- [ ] 运行 Lighthouse 测试
- [ ] 提交 sitemap 到 Google Search Console
- [ ] 配置监控和日志
- [ ] 设置自动备份
- [ ] 文档记录

---

**部署文档创建日期**: 2025-10-23  
**最后更新**: 2025-10-23  
**版本**: 1.0

如有问题，请查看常见问题部分或联系技术支持。


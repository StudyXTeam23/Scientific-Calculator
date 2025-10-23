# 🖥️ Nginx 服务器部署指南

## 📋 前置条件

- 一台 Linux 服务器（Ubuntu/CentOS/Debian）
- 服务器已安装 Nginx
- 拥有服务器 SSH 访问权限
- （可选）一个域名

---

## 🎯 部署步骤总览

```
1. 在本地打包项目 ✅ (已完成)
2. 准备服务器环境
3. 上传项目文件到服务器
4. 安装依赖和启动应用
5. 配置 Nginx 反向代理
6. 配置 HTTPS（可选但推荐）
7. 测试和验证
```

---

## 步骤 1: 在本地打包项目 ✅

**已完成！你的项目已成功构建。**

确认构建文件存在：
```powershell
# Windows PowerShell
cd f:\workspace\demo02\newProduct
ls .next  # 应该能看到构建文件
```

---

## 步骤 2: 准备服务器环境

### 2.1 连接到服务器

```bash
# 使用 SSH 连接到服务器
ssh username@your-server-ip

# 或使用密钥
ssh -i /path/to/key.pem username@your-server-ip
```

### 2.2 安装 Node.js（如果未安装）

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v  # 应显示 v18.x.x 或更高
npm -v
```

### 2.3 安装 PM2（进程管理器）

```bash
sudo npm install -g pm2
```

### 2.4 创建项目目录

```bash
# 创建项目目录
sudo mkdir -p /var/www/calculator
sudo chown -R $USER:$USER /var/www/calculator
cd /var/www/calculator
```

---

## 步骤 3: 上传项目文件到服务器

### 方式 A: 使用 Git（推荐）

```bash
# 在服务器上
cd /var/www/calculator
git clone https://your-git-repo.git .

# 如果使用私有仓库
git clone https://username:token@github.com/your-repo.git .
```

### 方式 B: 使用 SCP（从 Windows 上传）

```powershell
# 在 Windows 上，使用 PowerShell 或 Git Bash

# 1. 压缩项目（排除 node_modules）
cd f:\workspace\demo02
tar -czf calculator.tar.gz --exclude=node_modules --exclude=.next newProduct/

# 2. 上传到服务器
scp calculator.tar.gz username@your-server-ip:/var/www/calculator/

# 3. 在服务器上解压
ssh username@your-server-ip
cd /var/www/calculator
tar -xzf calculator.tar.gz --strip-components=1
rm calculator.tar.gz
```

### 方式 C: 使用 SFTP（使用 WinSCP 或 FileZilla）

1. 下载 WinSCP: https://winscp.net/
2. 连接到服务器
3. 上传 `newProduct` 文件夹到 `/var/www/calculator`

**重要：只上传这些文件/文件夹**：
```
必需上传：
✅ app/
✅ components/
✅ hooks/
✅ lib/
✅ types/
✅ public/
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ next.config.js
✅ tailwind.config.ts
✅ postcss.config.js

不需要上传：
❌ node_modules/
❌ .next/
❌ .git/
❌ docs/
❌ __tests__/
```

---

## 步骤 4: 在服务器上安装依赖和启动应用

### 4.1 安装生产依赖

```bash
cd /var/www/calculator
npm install --production
```

### 4.2 构建项目

```bash
npm run build
```

如果构建成功，你会看到：
```
✓ Compiled successfully
✓ Generating static pages (7/7)
✓ Finalizing page optimization
```

### 4.3 测试应用

```bash
# 测试运行（前台）
npm start

# 在浏览器访问 http://your-server-ip:3000
# 如果能看到计算器，说明应用正常！
# 按 Ctrl+C 停止
```

### 4.4 使用 PM2 启动应用（后台运行）

```bash
# 启动应用
pm2 start npm --name "calculator" -- start

# 设置开机自启
pm2 startup
# 复制并执行屏幕上显示的命令

# 保存 PM2 配置
pm2 save

# 查看应用状态
pm2 status

# 查看日志
pm2 logs calculator

# 其他有用命令
pm2 restart calculator  # 重启
pm2 stop calculator     # 停止
pm2 delete calculator   # 删除
```

---

## 步骤 5: 配置 Nginx 反向代理

### 5.1 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/calculator
```

### 5.2 添加以下配置

**配置 1: HTTP 基础配置（最简单）**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 公共资源
    location /public {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

**配置 2: 完整优化配置（推荐）**

```nginx
# 限制请求
limit_req_zone $binary_remote_addr zone=calculator:10m rate=10r/s;

# Gzip 压缩
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 日志
    access_log /var/log/nginx/calculator_access.log;
    error_log /var/log/nginx/calculator_error.log;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # 限制请求
    limit_req zone=calculator burst=20 nodelay;

    # 主应用代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js 静态资源（长期缓存）
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 图标和图片
    location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Robots 和 Sitemap
    location = /robots.txt {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    location = /sitemap.xml {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    # Manifest
    location = /manifest.json {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

### 5.3 启用配置并重启 Nginx

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/calculator /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 如果显示 "test is successful"，则重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 状态
sudo systemctl status nginx
```

### 5.4 配置防火墙

```bash
# Ubuntu (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## 步骤 6: 配置 HTTPS（使用 Let's Encrypt）

### 6.1 安装 Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS
sudo yum install certbot python3-certbot-nginx
```

### 6.2 获取 SSL 证书

```bash
# 自动配置（推荐）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 跟随提示：
# 1. 输入邮箱
# 2. 同意服务条款
# 3. 选择是否重定向 HTTP 到 HTTPS（选 2 - 重定向）
```

### 6.3 测试自动续期

```bash
# 测试续期（不会实际续期）
sudo certbot renew --dry-run

# 如果成功，证书会自动续期
```

### 6.4 查看证书信息

```bash
sudo certbot certificates
```

---

## 步骤 7: 测试和验证

### 7.1 功能测试

```bash
# 1. 访问你的域名
https://your-domain.com

# 2. 测试计算功能
# - 输入 2+3，点击 =，应该显示 5
# - 测试 sin(30) 在 Deg 模式
# - 测试键盘输入

# 3. 测试移动端
# - 使用手机访问
# - 检查响应式布局
```

### 7.2 SEO 验证

```bash
# 检查 robots.txt
curl https://your-domain.com/robots.txt

# 检查 sitemap.xml
curl https://your-domain.com/sitemap.xml

# 检查 manifest
curl https://your-domain.com/manifest.json

# 查看页面 meta 标签
curl https://your-domain.com | grep -i "meta"
```

### 7.3 性能测试

访问以下网站测试：
- Google Lighthouse: Chrome DevTools > Lighthouse
- PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/

目标分数：
- Performance: > 85
- SEO: > 90
- Accessibility: > 85

### 7.4 查看日志

```bash
# 应用日志
pm2 logs calculator

# Nginx 访问日志
sudo tail -f /var/log/nginx/calculator_access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/calculator_error.log
```

---

## 🔧 常见问题排查

### 问题 1: 无法访问网站

**检查项**：
```bash
# 1. 检查应用是否运行
pm2 status

# 2. 检查端口 3000 是否监听
netstat -tulpn | grep 3000

# 3. 检查 Nginx 状态
sudo systemctl status nginx

# 4. 检查防火墙
sudo ufw status  # Ubuntu
sudo firewall-cmd --list-all  # CentOS

# 5. 测试本地访问
curl http://localhost:3000
```

### 问题 2: 502 Bad Gateway

**原因**：Nginx 无法连接到 Node.js 应用

**解决**：
```bash
# 1. 确认应用正在运行
pm2 restart calculator

# 2. 检查端口
netstat -tulpn | grep 3000

# 3. 检查 Nginx 配置
sudo nginx -t
```

### 问题 3: HTTPS 不工作

**检查**：
```bash
# 1. 查看证书状态
sudo certbot certificates

# 2. 重新配置 HTTPS
sudo certbot --nginx -d your-domain.com

# 3. 检查 Nginx 配置
sudo nginx -t
sudo systemctl restart nginx
```

### 问题 4: 静态文件 404

**解决**：
```bash
# 确保 public 目录存在
ls -la /var/www/calculator/public/

# 确保权限正确
sudo chown -R $USER:$USER /var/www/calculator
chmod -R 755 /var/www/calculator

# 重启应用
pm2 restart calculator
```

### 问题 5: 图标不显示

**原因**：图标文件未创建

**解决**：
1. 在本地创建图标（见 `public/ICONS_README.md`）
2. 上传到服务器 `/var/www/calculator/public/`
3. 重启应用：`pm2 restart calculator`

---

## 📊 监控和维护

### 日常监控

```bash
# 查看应用状态
pm2 status

# 查看资源使用
pm2 monit

# 查看日志
pm2 logs calculator --lines 100

# 查看 Nginx 状态
sudo systemctl status nginx
```

### 定期维护

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade  # Ubuntu
sudo yum update  # CentOS

# 2. 清理日志
pm2 flush  # 清理 PM2 日志

# 3. 重启应用（如果需要）
pm2 restart calculator

# 4. 检查磁盘空间
df -h

# 5. 检查内存使用
free -h
```

### 自动备份

```bash
# 创建备份脚本
cat > /home/$USER/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/calculator"
mkdir -p $BACKUP_DIR

# 备份应用
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www calculator

# 备份 Nginx 配置
tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/sites-available/calculator

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /home/$USER/backup.sh

# 添加到 crontab（每天凌晨 2 点备份）
crontab -e
# 添加: 0 2 * * * /home/$USER/backup.sh
```

---

## 🚀 性能优化建议

### 1. 启用 HTTP/2

在 Nginx 配置中添加：
```nginx
listen 443 ssl http2;
```

### 2. 添加缓存层

考虑使用 Nginx FastCGI 缓存或 Redis

### 3. CDN 加速

将静态资源（图片、字体）部署到 CDN（如 CloudFlare）

### 4. 资源监控

安装监控工具：
```bash
# 安装 Netdata（实时监控）
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# 访问: http://your-server-ip:19999
```

---

## ✅ 部署完成检查清单

### 服务器配置
- [ ] Node.js 18+ 已安装
- [ ] PM2 已安装并配置自启
- [ ] Nginx 已安装并运行
- [ ] 防火墙已配置（允许 80, 443）

### 应用部署
- [ ] 项目文件已上传
- [ ] 依赖已安装（`npm install`）
- [ ] 项目已构建（`npm run build`）
- [ ] 应用已启动（`pm2 start`）
- [ ] 应用可通过 localhost:3000 访问

### Nginx 配置
- [ ] Nginx 配置文件已创建
- [ ] 配置文件已链接到 sites-enabled
- [ ] Nginx 配置测试通过（`nginx -t`）
- [ ] Nginx 已重启
- [ ] 可通过域名/IP 访问

### HTTPS 配置
- [ ] SSL 证书已安装
- [ ] HTTPS 可正常访问
- [ ] HTTP 自动重定向到 HTTPS
- [ ] 证书自动续期已配置

### 功能验证
- [ ] 主页正常显示
- [ ] 计算功能正常
- [ ] robots.txt 可访问
- [ ] sitemap.xml 可访问
- [ ] 移动端显示正常
- [ ] SEO 分数达标（Lighthouse）

### 监控和备份
- [ ] PM2 监控正常
- [ ] 日志可查看
- [ ] 备份脚本已配置
- [ ] （可选）监控工具已安装

---

## 📞 需要帮助？

如果遇到问题，检查：
1. PM2 日志：`pm2 logs calculator`
2. Nginx 日志：`sudo tail -f /var/log/nginx/calculator_error.log`
3. 系统日志：`sudo journalctl -xe`

---

**文档创建日期**: 2025-10-23  
**最后更新**: 2025-10-23

祝部署顺利！🚀


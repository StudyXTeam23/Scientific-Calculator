# 🚀 端口 18333 部署指南

## 📋 快速部署步骤

你的应用已配置为运行在端口 **18333** 上。

---

## 🎯 部署步骤

### 步骤 1: 上传文件到服务器

```bash
# 方式 A: 使用 SCP（从 Windows）
cd f:\workspace\demo02
tar -czf calculator.tar.gz --exclude=node_modules --exclude=.next newProduct/
scp calculator.tar.gz username@your-server-ip:/var/www/calculator/

# 方式 B: 使用 Git
ssh username@your-server-ip
cd /var/www/calculator
git clone https://your-repo-url.git .
```

---

### 步骤 2: 在服务器上安装和构建

```bash
# SSH 到服务器
ssh username@your-server-ip

# 进入项目目录
cd /var/www/calculator

# 解压（如果使用 SCP）
tar -xzf calculator.tar.gz --strip-components=1

# 安装依赖
npm install --production

# 构建项目
npm run build
```

---

### 步骤 3: 使用 PM2 启动（端口 18333）

```bash
# 方式 A: 直接启动（已在 package.json 配置端口）
pm2 start npm --name "calculator" -- start

# 方式 B: 或者使用环境变量
pm2 start npm --name "calculator" -e PORT=18333 -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs calculator
```

**验证应用运行**：
```bash
# 本地测试
curl http://localhost:18333

# 应该返回 HTML 内容
```

---

### 步骤 4: 配置 Nginx

#### 4.1 复制配置文件

将 `nginx-18333.conf` 上传到服务器：

```bash
# 从 Windows 上传
scp nginx-18333.conf username@your-server-ip:/tmp/

# 在服务器上移动到正确位置
ssh username@your-server-ip
sudo cp /tmp/nginx-18333.conf /etc/nginx/sites-available/calculator
```

#### 4.2 或者直接在服务器上创建

```bash
sudo nano /etc/nginx/sites-available/calculator
```

粘贴以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改为你的域名或 IP

    location / {
        proxy_pass http://localhost:18333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:18333;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

#### 4.3 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/calculator /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

### 步骤 5: 配置防火墙

```bash
# 开放端口 18333（可选，如果需要直接访问）
sudo ufw allow 18333/tcp

# 开放 HTTP/HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

### 步骤 6: 配置 HTTPS（推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 选择重定向 HTTP 到 HTTPS（推荐选 2）
```

---

## ✅ 验证部署

### 1. 检查应用状态

```bash
# PM2 状态
pm2 status

# 应该显示：
# calculator | online | 0 | npm | 18333 |
```

### 2. 检查端口

```bash
# 检查端口 18333 是否在监听
netstat -tulpn | grep 18333

# 应该显示类似：
# tcp   0   0   0.0.0.0:18333   0.0.0.0:*   LISTEN   12345/node
```

### 3. 测试访问

```bash
# 本地测试
curl http://localhost:18333

# 外部测试（通过 Nginx）
curl http://your-domain.com

# 或在浏览器访问
# http://your-domain.com
# https://your-domain.com（如果配置了 HTTPS）
```

### 4. 功能测试

在浏览器中：
- 访问你的域名
- 测试计算：2+3=5
- 测试科学函数：sin(30)
- 测试键盘输入

---

## 🔧 常用管理命令

### PM2 管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs calculator

# 实时监控
pm2 monit

# 重启应用
pm2 restart calculator

# 停止应用
pm2 stop calculator

# 删除应用
pm2 delete calculator
```

### Nginx 管理

```bash
# 查看状态
sudo systemctl status nginx

# 重启
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx

# 测试配置
sudo nginx -t

# 查看访问日志
sudo tail -f /var/log/nginx/calculator_access.log

# 查看错误日志
sudo tail -f /var/log/nginx/calculator_error.log
```

---

## 🔍 故障排查

### 问题 1: 502 Bad Gateway

**原因**：应用未运行或端口错误

**解决**：
```bash
# 检查应用状态
pm2 status

# 检查端口
netstat -tulpn | grep 18333

# 重启应用
pm2 restart calculator

# 查看日志
pm2 logs calculator --lines 50
```

### 问题 2: 端口被占用

**检查**：
```bash
# 查看谁在使用端口 18333
sudo lsof -i :18333

# 或
netstat -tulpn | grep 18333
```

**解决**：
```bash
# 方式 A: 停止占用端口的进程
sudo kill -9 <PID>

# 方式 B: 更改应用端口
# 编辑 package.json，修改 start 脚本中的端口号
```

### 问题 3: 无法通过域名访问

**检查**：
```bash
# 1. 检查 Nginx 配置
sudo nginx -t

# 2. 检查 DNS 解析
ping your-domain.com

# 3. 检查防火墙
sudo ufw status

# 4. 测试本地访问
curl http://localhost:18333
```

### 问题 4: HTTPS 不工作

**解决**：
```bash
# 重新配置证书
sudo certbot --nginx -d your-domain.com

# 查看证书状态
sudo certbot certificates

# 强制续期
sudo certbot renew --force-renewal
```

---

## 📊 性能监控

### 查看资源使用

```bash
# CPU 和内存
pm2 monit

# 详细信息
pm2 show calculator

# 系统资源
htop  # 或 top
```

### 日志管理

```bash
# 查看最近日志
pm2 logs calculator --lines 100

# 实时日志
pm2 logs calculator --lines 0

# 清理日志
pm2 flush
```

---

## 🔄 更新应用

```bash
# 1. 上传新代码
cd /var/www/calculator
git pull  # 或重新上传文件

# 2. 安装新依赖（如果有）
npm install --production

# 3. 重新构建
npm run build

# 4. 重启应用
pm2 restart calculator

# 5. 验证
pm2 logs calculator
```

---

## 📝 配置文件位置

```
项目目录: /var/www/calculator
Nginx 配置: /etc/nginx/sites-available/calculator
Nginx 日志: /var/log/nginx/calculator_*.log
PM2 日志: ~/.pm2/logs/
SSL 证书: /etc/letsencrypt/live/your-domain.com/
```

---

## ✅ 部署检查清单

- [ ] 文件已上传到服务器
- [ ] 依赖已安装（npm install）
- [ ] 项目已构建（npm run build）
- [ ] 应用已启动（pm2 start）
- [ ] 应用运行在端口 18333
- [ ] Nginx 配置已创建
- [ ] Nginx 配置已启用
- [ ] 防火墙已配置
- [ ] 可通过域名访问
- [ ] HTTPS 已配置（可选）
- [ ] 功能测试通过

---

## 🎯 快速命令参考

```bash
# 一键部署脚本
cd /var/www/calculator && \
npm install --production && \
npm run build && \
pm2 restart calculator || pm2 start npm --name "calculator" -- start && \
pm2 save

# 一键检查
pm2 status && \
netstat -tulpn | grep 18333 && \
sudo systemctl status nginx && \
curl -I http://localhost:18333
```

---

## 📞 需要帮助？

如果遇到问题：

1. **查看应用日志**：`pm2 logs calculator`
2. **查看 Nginx 日志**：`sudo tail -f /var/log/nginx/calculator_error.log`
3. **检查端口**：`netstat -tulpn | grep 18333`
4. **测试配置**：`sudo nginx -t`

---

**端口配置**: 18333  
**文档创建日期**: 2025-10-23  
**最后更新**: 2025-10-23

祝部署顺利！🚀


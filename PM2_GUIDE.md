# 🚀 PM2 使用指南

## 📋 目录

1. [快速开始](#快速开始)
2. [详细步骤](#详细步骤)
3. [常用命令](#常用命令)
4. [配置说明](#配置说明)
5. [故障排查](#故障排查)

---

## ⚡ 快速开始

### Windows 用户

```powershell
# 1. 确保已安装 PM2
npm install -g pm2

# 2. 进入项目目录
cd f:\workspace\demo02\newProduct

# 3. 运行启动脚本
.\start-pm2.ps1

# 或手动启动
pm2 start ecosystem.config.js
```

### Linux/Mac 用户

```bash
# 1. 确保已安装 PM2
npm install -g pm2

# 2. 进入项目目录
cd /path/to/newProduct

# 3. 运行启动脚本
chmod +x start-pm2.sh
./start-pm2.sh

# 或手动启动
pm2 start ecosystem.config.js
```

---

## 📖 详细步骤

### 步骤 1: 安装 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 验证安装
pm2 -v
```

**输出示例**：
```
5.3.0
```

### 步骤 2: 确保项目已构建

```bash
# 进入项目目录
cd f:\workspace\demo02\newProduct

# 如果 .next 目录不存在，先构建
npm run build
```

### 步骤 3: 启动应用

**方式 A - 使用配置文件（推荐）**：

```bash
# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status
```

**方式 B - 直接命令**：

```bash
# 启动应用
pm2 start npm --name "calculator" -- start

# 或指定端口
pm2 start npm --name "calculator" -e PORT=18333 -- start
```

**方式 C - 使用启动脚本**：

```powershell
# Windows
.\start-pm2.ps1

# Linux/Mac
./start-pm2.sh
```

### 步骤 4: 设置开机自启（可选）

```bash
# 生成启动脚本
pm2 startup

# 复制并执行屏幕上显示的命令（Linux/Mac 需要）
# 例如：sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username

# 保存当前进程列表
pm2 save
```

### 步骤 5: 验证运行

```bash
# 查看应用状态
pm2 status

# 应该看到类似输出：
# ┌─────┬───────────────┬─────────┬─────────┬───────┬────────┐
# │ id  │ name          │ mode    │ ↺      │ status│ cpu    │
# ├─────┼───────────────┼─────────┼─────────┼───────┼────────┤
# │ 0   │ calculator    │ cluster │ 0       │ online│ 0%     │
# └─────┴───────────────┴─────────┴─────────┴───────┴────────┘

# 查看日志
pm2 logs calculator

# 访问应用
# 浏览器打开: http://localhost:18333
```

---

## 💻 常用命令

### 基本操作

```bash
# 启动应用
pm2 start ecosystem.config.js
pm2 start npm --name "calculator" -- start

# 重启应用
pm2 restart calculator
pm2 restart ecosystem.config.js
pm2 restart all              # 重启所有应用

# 停止应用
pm2 stop calculator
pm2 stop all                 # 停止所有应用

# 删除应用
pm2 delete calculator
pm2 delete all               # 删除所有应用

# 重新加载（0 秒停机）
pm2 reload calculator
```

### 查看信息

```bash
# 查看所有应用状态
pm2 status
pm2 list
pm2 ls

# 查看单个应用详情
pm2 show calculator
pm2 describe calculator

# 实时监控
pm2 monit

# 查看日志
pm2 logs                     # 所有应用日志
pm2 logs calculator          # 特定应用日志
pm2 logs calculator --lines 100  # 显示最近 100 行
pm2 logs calculator --err    # 只看错误日志
pm2 logs calculator --out    # 只看输出日志

# 实时日志（tail -f）
pm2 logs calculator --lines 0

# 清空日志
pm2 flush
pm2 flush calculator
```

### 进程管理

```bash
# 列出所有进程
pm2 list

# 保存当前进程列表
pm2 save

# 恢复之前保存的进程
pm2 resurrect

# 清除保存的进程列表
pm2 cleardump

# 设置开机自启
pm2 startup
pm2 save

# 取消开机自启
pm2 unstartup
```

### 更新和升级

```bash
# 更新 PM2
npm install -g pm2@latest

# 更新 PM2 守护进程
pm2 update
```

---

## ⚙️ 配置说明

### ecosystem.config.js 配置文件

```javascript
module.exports = {
  apps: [
    {
      // 基本配置
      name: 'calculator',              // 应用名称
      script: 'npm',                   // 执行的脚本
      args: 'start',                   // 脚本参数
      cwd: './',                       // 工作目录
      
      // 执行模式
      instances: 1,                    // 实例数量（1 或 'max'）
      exec_mode: 'cluster',            // cluster 或 fork
      
      // 监控和重启
      watch: false,                    // 监听文件变化
      max_memory_restart: '500M',      // 内存超过 500M 自动重启
      autorestart: true,               // 自动重启
      min_uptime: '10s',               // 最小运行时间
      max_restarts: 10,                // 最大重启次数
      restart_delay: 4000,             // 重启延迟（毫秒）
      
      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 18333,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      
      // 日志
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}
```

### 使用不同环境

```bash
# 生产环境（默认）
pm2 start ecosystem.config.js

# 开发环境
pm2 start ecosystem.config.js --env development

# 停止并删除，然后用新环境启动
pm2 delete calculator
pm2 start ecosystem.config.js --env development
```

---

## 🔧 故障排查

### 问题 1: 应用无法启动

**检查步骤**：

```bash
# 1. 查看日志
pm2 logs calculator --lines 100

# 2. 检查项目是否已构建
ls .next  # 应该存在

# 3. 手动测试启动
npm start

# 4. 检查端口是否被占用
netstat -ano | findstr :18333  # Windows
lsof -i :18333                 # Linux/Mac
```

**常见原因**：
- 项目未构建（缺少 `.next` 目录）
- 端口被占用
- 依赖未安装（`npm install`）

### 问题 2: 应用频繁重启

**检查**：

```bash
# 查看重启次数
pm2 status

# 查看错误日志
pm2 logs calculator --err --lines 50
```

**解决方案**：

1. 增加内存限制：
```javascript
// ecosystem.config.js
max_memory_restart: '1G'  // 改为 1G
```

2. 增加最小运行时间：
```javascript
min_uptime: '60s'  // 改为 60 秒
```

3. 检查应用错误并修复

### 问题 3: 端口冲突

**检查端口占用**：

```bash
# Windows
netstat -ano | findstr :18333

# Linux/Mac
lsof -i :18333
sudo netstat -tulpn | grep 18333
```

**解决方案**：

1. 停止占用端口的进程
2. 或修改应用端口（编辑 `package.json` 或 `ecosystem.config.js`）

### 问题 4: PM2 命令找不到

**原因**：PM2 未全局安装或未添加到 PATH

**解决**：

```bash
# 重新安装 PM2
npm install -g pm2

# 验证安装
pm2 -v

# 如果还是不行，使用 npx
npx pm2 start ecosystem.config.js
```

### 问题 5: 开机自启不工作

**重新配置**：

```bash
# 1. 删除旧配置
pm2 unstartup

# 2. 重新设置
pm2 startup

# 3. 复制并执行显示的命令

# 4. 保存进程列表
pm2 save
```

---

## 📊 监控和日志

### 实时监控

```bash
# 进入监控界面
pm2 monit

# 显示信息：
# - CPU 使用率
# - 内存使用
# - 实时日志
# - 进程列表

# 按 Ctrl+C 退出
```

### 查看详细信息

```bash
# 查看应用详情
pm2 show calculator

# 输出包括：
# - 进程信息
# - 启动时间
# - 重启次数
# - 内存使用
# - CPU 使用
# - 日志文件位置
```

### 日志管理

```bash
# 查看日志文件位置
pm2 show calculator | grep "log path"

# 手动查看日志文件
tail -f ./logs/out.log  # 输出日志
tail -f ./logs/err.log  # 错误日志

# 清空日志
pm2 flush

# 日志轮转（安装插件）
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🔄 更新应用

### 零停机更新

```bash
# 1. 更新代码
git pull  # 或重新上传文件

# 2. 安装新依赖（如果有）
npm install

# 3. 重新构建
npm run build

# 4. 重新加载应用（0 秒停机）
pm2 reload calculator

# 或重启应用
pm2 restart calculator
```

### 批量更新

```bash
# 更新所有应用
pm2 reload all

# 或重启所有应用
pm2 restart all
```

---

## 📚 进阶用法

### 多实例（集群模式）

```javascript
// ecosystem.config.js
{
  instances: 'max',  // 或具体数字，如 4
  exec_mode: 'cluster',
}
```

启动：
```bash
pm2 start ecosystem.config.js
```

### 自定义日志格式

```javascript
// ecosystem.config.js
{
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  merge_logs: true,
  error_file: './logs/err-${Date.now()}.log',
  out_file: './logs/out-${Date.now()}.log',
}
```

### 环境变量管理

```javascript
// ecosystem.config.js
{
  env_production: {
    NODE_ENV: 'production',
    PORT: 18333,
    API_URL: 'https://api.example.com',
  },
  env_staging: {
    NODE_ENV: 'staging',
    PORT: 18334,
    API_URL: 'https://staging-api.example.com',
  },
}
```

使用：
```bash
pm2 start ecosystem.config.js --env production
pm2 start ecosystem.config.js --env staging
```

---

## ✅ 最佳实践

1. **使用配置文件**：`ecosystem.config.js` 便于管理和版本控制
2. **设置日志轮转**：防止日志文件过大
3. **监控内存使用**：设置合理的 `max_memory_restart`
4. **使用集群模式**：充分利用多核 CPU
5. **定期备份**：保存 PM2 进程列表（`pm2 save`）
6. **监控和告警**：使用 PM2 Plus 或其他监控工具

---

## 🔗 有用的资源

- [PM2 官方文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 GitHub](https://github.com/Unitech/pm2)
- [PM2 Plus（监控平台）](https://pm2.io/)

---

## 📋 快速命令参考

```bash
# 启动
pm2 start ecosystem.config.js

# 状态
pm2 status

# 日志
pm2 logs calculator

# 监控
pm2 monit

# 重启
pm2 restart calculator

# 停止
pm2 stop calculator

# 删除
pm2 delete calculator

# 保存
pm2 save

# 开机自启
pm2 startup && pm2 save
```

---

**文档创建日期**: 2025-10-23  
**最后更新**: 2025-10-23  
**PM2 版本**: 5.x

祝使用愉快！🚀


#!/bin/bash

# Scientific Calculator - PM2 启动脚本
# 用途：快速启动/重启应用

echo "🚀 Scientific Calculator - PM2 启动脚本"
echo "========================================"
echo ""

# 检查是否已安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装"
    echo "请先安装 PM2: npm install -g pm2"
    exit 1
fi

echo "✅ PM2 已安装"
echo ""

# 检查是否需要先构建
if [ ! -d ".next" ]; then
    echo "⚠️ .next 目录不存在，需要先构建项目"
    echo "正在构建..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败"
        exit 1
    fi
    echo "✅ 构建成功"
    echo ""
fi

# 检查应用是否已经在运行
if pm2 list | grep -q "calculator"; then
    echo "📦 应用已存在，正在重启..."
    pm2 restart ecosystem.config.js
else
    echo "🚀 正在启动应用..."
    pm2 start ecosystem.config.js
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 应用启动成功！"
    echo ""
    echo "📊 应用信息："
    pm2 show calculator
    echo ""
    echo "💡 常用命令："
    echo "  pm2 status              - 查看状态"
    echo "  pm2 logs calculator     - 查看日志"
    echo "  pm2 monit               - 实时监控"
    echo "  pm2 restart calculator  - 重启"
    echo "  pm2 stop calculator     - 停止"
    echo ""
    echo "🌐 访问地址："
    echo "  http://localhost:18333"
    echo ""
    
    # 询问是否设置开机自启
    read -p "是否设置开机自启？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pm2 startup
        pm2 save
        echo "✅ 已设置开机自启"
    fi
else
    echo "❌ 启动失败，请查看错误信息"
    exit 1
fi


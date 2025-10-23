#!/bin/bash

# Scientific Calculator - 部署脚本
# 用途：自动化部署到服务器

set -e

echo "🚀 Scientific Calculator - 部署脚本"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
echo "📦 检查 Node.js 版本..."
NODE_VERSION=$(node -v)
echo "当前 Node.js 版本: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v(18|19|20|21) ]]; then
    echo -e "${RED}❌ 需要 Node.js 18 或更高版本${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本检查通过${NC}"
echo ""

# 检查依赖
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️ node_modules 不存在，正在安装依赖...${NC}"
    npm install
else
    echo -e "${GREEN}✅ 依赖已安装${NC}"
fi
echo ""

# 清理旧构建
echo "🧹 清理旧构建..."
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "${GREEN}✅ 已清理 .next 目录${NC}"
fi
echo ""

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建成功！${NC}"
else
    echo -e "${RED}❌ 构建失败，请检查错误信息${NC}"
    exit 1
fi
echo ""

# 检查构建输出
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ .next 目录未生成，构建可能失败${NC}"
    exit 1
fi

# 显示构建统计
echo "📊 构建统计:"
if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "Build ID: $BUILD_ID"
fi
echo ""

# 提示下一步
echo -e "${GREEN}✅ 项目构建完成！${NC}"
echo ""
echo "📝 下一步操作:"
echo ""
echo "1. 本地测试："
echo "   npm start"
echo ""
echo "2. 使用 PM2 部署（推荐）："
echo "   npm install -g pm2"
echo "   pm2 start npm --name 'calculator' -- start"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "3. 使用 Vercel 部署："
echo "   npm i -g vercel"
echo "   vercel --prod"
echo ""
echo "4. 使用 Docker 部署："
echo "   docker build -t scientific-calculator ."
echo "   docker run -p 3000:3000 scientific-calculator"
echo ""
echo "📚 查看完整部署指南: DEPLOYMENT_GUIDE.md"
echo ""
echo -e "${GREEN}🎉 准备就绪！${NC}"


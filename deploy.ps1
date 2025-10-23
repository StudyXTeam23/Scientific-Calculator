# Scientific Calculator - Windows 部署脚本
# 用途：自动化构建和部署

Write-Host "🚀 Scientific Calculator - 部署脚本" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 版本
Write-Host "📦 检查 Node.js 版本..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "当前 Node.js 版本: $nodeVersion" -ForegroundColor White
    
    if (-not ($nodeVersion -match "v(18|19|20|21)")) {
        Write-Host "❌ 需要 Node.js 18 或更高版本" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js 版本检查通过" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装或未添加到 PATH" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 检查依赖
Write-Host "📦 检查依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️ node_modules 不存在，正在安装依赖..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ 依赖已安装" -ForegroundColor Green
}
Write-Host ""

# 清理旧构建
Write-Host "🧹 清理旧构建..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ 已清理 .next 目录" -ForegroundColor Green
}
Write-Host ""

# 构建项目
Write-Host "🔨 构建项目..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 构建成功！" -ForegroundColor Green
} else {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 检查构建输出
if (-not (Test-Path ".next")) {
    Write-Host "❌ .next 目录未生成，构建可能失败" -ForegroundColor Red
    exit 1
}

# 显示构建统计
Write-Host "📊 构建统计:" -ForegroundColor Cyan
if (Test-Path ".next/BUILD_ID") {
    $buildId = Get-Content ".next/BUILD_ID"
    Write-Host "Build ID: $buildId" -ForegroundColor White
}
Write-Host ""

# 提示下一步
Write-Host "✅ 项目构建完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 下一步操作:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 本地测试：" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "2. 使用 PM2 部署（推荐）：" -ForegroundColor Yellow
Write-Host "   npm install -g pm2" -ForegroundColor White
Write-Host "   pm2 start npm --name `"calculator`" -- start" -ForegroundColor White
Write-Host "   pm2 save" -ForegroundColor White
Write-Host ""
Write-Host "3. 使用 Vercel 部署：" -ForegroundColor Yellow
Write-Host "   npm i -g vercel" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "4. 使用 Docker 部署：" -ForegroundColor Yellow
Write-Host "   docker build -t scientific-calculator ." -ForegroundColor White
Write-Host "   docker run -p 3000:3000 scientific-calculator" -ForegroundColor White
Write-Host ""
Write-Host "📚 查看完整部署指南: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 准备就绪！" -ForegroundColor Green

# 询问是否立即启动
Write-Host ""
$start = Read-Host "是否立即启动应用？(Y/N)"
if ($start -eq 'Y' -or $start -eq 'y') {
    Write-Host ""
    Write-Host "🚀 正在启动应用..." -ForegroundColor Yellow
    npm start
}


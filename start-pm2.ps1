# Scientific Calculator - PM2 启动脚本（Windows）
# 用途：快速启动/重启应用

Write-Host "🚀 Scientific Calculator - PM2 启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否已安装 PM2
try {
    $pm2Version = pm2 -v
    Write-Host "✅ PM2 已安装 (版本: $pm2Version)" -ForegroundColor Green
} catch {
    Write-Host "❌ PM2 未安装" -ForegroundColor Red
    Write-Host "请先安装 PM2: npm install -g pm2" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 检查是否需要先构建
if (-not (Test-Path ".next")) {
    Write-Host "⚠️ .next 目录不存在，需要先构建项目" -ForegroundColor Yellow
    Write-Host "正在构建..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 构建失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ 构建成功" -ForegroundColor Green
    Write-Host ""
}

# 检查应用是否已经在运行
$pmList = pm2 list
if ($pmList -match "calculator") {
    Write-Host "📦 应用已存在，正在重启..." -ForegroundColor Yellow
    pm2 restart ecosystem.config.js
} else {
    Write-Host "🚀 正在启动应用..." -ForegroundColor Yellow
    pm2 start ecosystem.config.js
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 应用启动成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 应用信息：" -ForegroundColor Cyan
    pm2 show calculator
    Write-Host ""
    Write-Host "💡 常用命令：" -ForegroundColor Cyan
    Write-Host "  pm2 status              - 查看状态" -ForegroundColor White
    Write-Host "  pm2 logs calculator     - 查看日志" -ForegroundColor White
    Write-Host "  pm2 monit               - 实时监控" -ForegroundColor White
    Write-Host "  pm2 restart calculator  - 重启" -ForegroundColor White
    Write-Host "  pm2 stop calculator     - 停止" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 访问地址：" -ForegroundColor Cyan
    Write-Host "  http://localhost:18333" -ForegroundColor White
    Write-Host ""
    
    # 询问是否设置开机自启
    $setup = Read-Host "是否设置开机自启？(Y/N)"
    if ($setup -eq 'Y' -or $setup -eq 'y') {
        pm2 startup
        pm2 save
        Write-Host "✅ 已设置开机自启" -ForegroundColor Green
    }
} else {
    Write-Host "❌ 启动失败，请查看错误信息" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "按任意键继续..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


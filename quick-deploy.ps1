# Quick Deploy Script for Synapsify-Web
# Run this PowerShell script from the project root to deploy to server

$profile = ".\synapsify.tlp"
$bitvisePath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "🚀 Synapsify-Web Quick Deploy" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if profile exists
if (-not (Test-Path $profile)) {
    Write-Host "❌ Error: synapsify.tlp profile not found!" -ForegroundColor Red
    Write-Host "Please ensure synapsify.tlp is in the project root." -ForegroundColor Yellow
    exit 1
}

Write-Host "📥 Pulling latest changes from GitHub..." -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="cd /root/Synapsify-Web && git pull"

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="cd /root/Synapsify-Web && npm install"

Write-Host "🔨 Building project..." -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="cd /root/Synapsify-Web && npm run build"

Write-Host "🔄 Restarting application..." -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="pm2 restart synapsify-web"

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Check status with: pm2 status" -ForegroundColor Cyan
Write-Host "View logs with: pm2 logs synapsify-web" -ForegroundColor Cyan


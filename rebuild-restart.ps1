# Rebuild and Restart Script
# Run this after uploading files to rebuild and restart the application

$profile = ".\synapsify.tlp"
$bitvisePath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "🔨 Rebuilding and Restarting Synapsify-Web" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Building project..." -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="cd /root/Synapsify-Web && npm run build"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🔄 Restarting application..." -ForegroundColor Yellow
    & $bitvisePath -profile=$profile -cmd="pm2 restart synapsify-web"
    
    Write-Host ""
    Write-Host "✅ Rebuild and restart complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check status: .\check-status.ps1" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Build failed! Check logs above." -ForegroundColor Red
}


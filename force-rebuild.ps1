$sexecPath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$profile = ".\synapsify.tlp"

Write-Host "🧹 Clearing Next.js cache and rebuilding..." -ForegroundColor Cyan

# Clear the .next build cache
Write-Host "`n1️⃣ Removing .next directory..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && rm -rf .next"

# Fresh rebuild
Write-Host "`n2️⃣ Running fresh build..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && npm run build"

# Restart PM2
Write-Host "`n3️⃣ Restarting PM2..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="pm2 restart synapsify-web"

Write-Host "`n✅ Cache cleared and app rebuilt!" -ForegroundColor Green
Write-Host "Please hard refresh your browser (Ctrl+Shift+R)" -ForegroundColor Cyan

$sexecPath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$profile = ".\synapsify.tlp"

Write-Host "🔄 Forcing server to sync with GitHub and clean rebuild..." -ForegroundColor Cyan

# Step 1: Hard reset to latest commit
Write-Host "`n1️⃣ Resetting server to latest GitHub code..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && git reset --hard origin/main"

# Step 2: Pull latest
Write-Host "`n2️⃣ Pulling latest changes..." -ForegroundColor Yellow  
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && git pull"

# Step 3: Remove node_modules and .next
Write-Host "`n3️⃣ Clearing all caches..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && rm -rf .next node_modules"

# Step 4: Fresh install
Write-Host "`n4️⃣ Fresh npm install..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && npm install"

# Step 5: Clean build
Write-Host "`n5️⃣ Building from scratch..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && npm run build"

# Step 6: Restart PM2
Write-Host "`n6️⃣ Restarting application..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="pm2 restart synapsify-web"

Write-Host "`n✅ Complete clean rebuild finished!" -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANT: Clear browser cache with Ctrl+Shift+R" -ForegroundColor Yellow

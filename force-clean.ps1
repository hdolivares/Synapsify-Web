$sexecPath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$profile = ".\synapsify.tlp"
$cmd = "cd /root/Synapsify-Web && git fetch --all && git reset --hard origin/main && rm -rf node_modules .next && npm install && npm run build && pm2 restart synapsify-web"
Write-Host "🔧 Running forced clean rebuild on server..." -ForegroundColor Cyan
& $sexecPath -profile=$profile -cmd=$cmd
Write-Host "✅ Clean rebuild completed" -ForegroundColor Green

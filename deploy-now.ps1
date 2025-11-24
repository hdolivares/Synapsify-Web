$sexecPath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$profile = ".\synapsify.tlp"
$cmd = "cd /root/Synapsify-Web && git pull && npm install && npm run build && pm2 restart synapsify-web"

Write-Host "🚀 Deploying updates to server..." -ForegroundColor Cyan
& $sexecPath -profile=$profile -cmd=$cmd
Write-Host "✅ Deployment complete!" -ForegroundColor Green

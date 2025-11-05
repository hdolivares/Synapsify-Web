# Check Server Status Script
# Run this to check the status of your Synapsify-Web deployment

$profile = ".\synapsify.tlp"
$bitvisePath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "📊 Synapsify-Web Server Status" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check PM2 status
Write-Host "PM2 Status:" -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="pm2 status"

Write-Host ""
Write-Host "PM2 Process Info:" -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="pm2 info synapsify-web"

Write-Host ""
Write-Host "Nginx Status:" -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="systemctl status nginx --no-pager -l"

Write-Host ""
Write-Host "Port 3000 Check:" -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="netstat -tlnp | grep 3000 || echo 'Port 3000 not in use'"

Write-Host ""
Write-Host "Recent Logs (last 20 lines):" -ForegroundColor Yellow
& $bitvisePath -profile=$profile -cmd="pm2 logs synapsify-web --lines 20 --nostream"


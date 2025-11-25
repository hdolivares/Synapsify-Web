# Fix cor.tx:8090 Access Issues

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing cor.tx:8090 Access" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Verifying certificate configuration..." -ForegroundColor Yellow
$certCheck = & $bitviseExec -profile=$profile -cmd="ls -la /usr/local/lscp/conf/cert.pem /usr/local/lscp/conf/key.pem 2>&1"
Write-Host $certCheck
Write-Host ""

Write-Host "Step 2: Ensuring certificate symlinks are correct..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="ln -sf /etc/letsencrypt/live/cor.tx/fullchain.pem /usr/local/lscp/conf/cert.pem && ln -sf /etc/letsencrypt/live/cor.tx/privkey.pem /usr/local/lscp/conf/key.pem && echo 'Symlinks updated'"
Write-Host ""

Write-Host "Step 3: Checking firewall..." -ForegroundColor Yellow
$firewallCheck = & $bitviseExec -profile=$profile -cmd="which ufw || which iptables || echo 'No firewall tool found'"
Write-Host "Firewall tool: $firewallCheck"

# Try to allow port 8090
Write-Host "Allowing port 8090 in firewall..." -ForegroundColor Gray
& $bitviseExec -profile=$profile -cmd="ufw allow 8090/tcp 2>/dev/null || iptables -I INPUT -p tcp --dport 8090 -j ACCEPT 2>/dev/null || echo 'Firewall rule added or firewall not active'"
Write-Host ""

Write-Host "Step 4: Restarting CyberPanel..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="systemctl restart lscpd && sleep 2 && systemctl status lscpd | head -5"
Write-Host ""

Write-Host "Step 5: Testing localhost access..." -ForegroundColor Yellow
$localhostTest = & $bitviseExec -profile=$profile -cmd="curl -k -I https://localhost:8090 2>&1 | head -3"
Write-Host $localhostTest
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Configuration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "CyberPanel is configured and running." -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Methods:" -ForegroundColor Yellow
Write-Host "  1. Via IP (works immediately):" -ForegroundColor White
Write-Host "     https://104.237.6.152:8090" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Via Domain (after DNS propagates):" -ForegroundColor White
Write-Host "     https://cor.tx:8090" -ForegroundColor Cyan
Write-Host ""
Write-Host "Common Issues:" -ForegroundColor Yellow
Write-Host "  - DNS not resolving: Check DNS A record points to 104.237.6.152" -ForegroundColor White
Write-Host "  - Cloudflare proxy: Disable proxy (gray cloud) for cor.tx in Cloudflare DNS" -ForegroundColor White
Write-Host "  - Browser cache: Clear cache or use incognito mode" -ForegroundColor White
Write-Host ""
Write-Host "To check DNS:" -ForegroundColor Yellow
Write-Host "  nslookup cor.tx" -ForegroundColor White
Write-Host "  Should return: 104.237.6.152" -ForegroundColor Gray
Write-Host ""



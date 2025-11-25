# Switch CyberPanel SSL from cor.tx to synapsify.app

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$domain = "synapsify.app"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Switching CyberPanel to synapsify.app" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking synapsify.app SSL certificate..." -ForegroundColor Yellow
$certCheck = & $bitviseExec -profile=$profile -cmd="ls -la /etc/letsencrypt/live/$domain/ 2>/dev/null | head -5 || echo 'Certificate directory not found'"
Write-Host $certCheck
Write-Host ""

# Check if certificate files exist
$certExists = & $bitviseExec -profile=$profile -cmd="test -f /etc/letsencrypt/live/$domain/fullchain.pem && test -f /etc/letsencrypt/live/$domain/privkey.pem && echo 'YES' || echo 'NO'"
if ($certExists -eq "NO") {
    Write-Host "⚠️  SSL certificate not found for $domain" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to issue SSL certificate for $domain in CyberPanel:" -ForegroundColor Cyan
    Write-Host "  1. Go to: Websites → List Websites" -ForegroundColor White
    Write-Host "  2. Click 'Manage' next to $domain" -ForegroundColor White
    Write-Host "  3. Go to: SSL → Issue SSL" -ForegroundColor White
    Write-Host "  4. Select: Let's Encrypt" -ForegroundColor White
    Write-Host "  5. Click 'Issue SSL'" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter after issuing SSL certificate, or Ctrl+C to cancel..." -ForegroundColor Yellow
    Read-Host
}

Write-Host "Step 2: Updating CyberPanel certificate symlinks..." -ForegroundColor Yellow
$updateSymlinks = @"
# Update certificate symlinks to synapsify.app
ln -sf /etc/letsencrypt/live/$domain/fullchain.pem /usr/local/lscp/conf/cert.pem
ln -sf /etc/letsencrypt/live/$domain/privkey.pem /usr/local/lscp/conf/key.pem

# Verify symlinks
echo "Certificate symlinks updated:"
ls -la /usr/local/lscp/conf/cert.pem /usr/local/lscp/conf/key.pem
"@

$updateSymlinks | Out-File -FilePath "update-synapsify-symlinks.sh" -Encoding ASCII -NoNewline
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o update-synapsify-symlinks.sh /tmp/update-synapsify-symlinks.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/update-synapsify-symlinks.sh && bash /tmp/update-synapsify-symlinks.sh"

Write-Host ""

Write-Host "Step 3: Verifying certificate..." -ForegroundColor Yellow
$certInfo = & $bitviseExec -profile=$profile -cmd="openssl x509 -in /usr/local/lscp/conf/cert.pem -noout -subject -issuer 2>/dev/null | head -2"
Write-Host $certInfo
Write-Host ""

Write-Host "Step 4: Restarting CyberPanel..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="systemctl restart lscpd && sleep 3 && systemctl status lscpd | head -8"
Write-Host ""

Write-Host "Step 5: Testing CyberPanel access..." -ForegroundColor Yellow
$testResult = & $bitviseExec -profile=$profile -cmd="curl -k -I https://localhost:8090 2>&1 | head -3"
Write-Host $testResult
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Configuration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "CyberPanel is now configured for $domain" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access CyberPanel at:" -ForegroundColor Yellow
Write-Host "  https://$domain:8090" -ForegroundColor White
Write-Host "  https://104.237.6.152:8090" -ForegroundColor White
Write-Host ""
Write-Host "Note: Ensure DNS for $domain points to 104.237.6.152" -ForegroundColor Gray
Write-Host ""


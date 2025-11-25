# Configure OpenLiteSpeed for cor.tx domain
# This script adds cor.tx to OpenLiteSpeed and prepares it for SSL

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$domain = "cor.tx"
$serverIP = "104.237.6.152"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenLiteSpeed Configuration for $domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Add domain to OpenLiteSpeed listener
Write-Host "Step 1: Adding $domain to OpenLiteSpeed listener..." -ForegroundColor Yellow

$lswsConfigScript = @'
#!/bin/bash
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.conf"
BACKUP_FILE="/usr/local/lsws/conf/httpd_config.conf.backup.$(date +%Y%m%d_%H%M%S)"

# Backup config
cp $CONFIG_FILE $BACKUP_FILE
echo "Backup created: $BACKUP_FILE"

# Check if domain already exists
if grep -q "map.*cor.tx" $CONFIG_FILE; then
    echo "Domain cor.tx already exists in listener configuration"
else
    # Add domain to listener Default section (after existing maps)
    sed -i '/listener Default{/,/}/ {
        /map.*synapsify.app/a\
    map                     cor.tx cor.tx
    }' $CONFIG_FILE
    
    echo "Added cor.tx to OpenLiteSpeed listener"
fi

# Verify the change
echo ""
echo "Current listener configuration:"
grep -A 10 "listener Default" $CONFIG_FILE | grep "map"
'@

$lswsConfigScript | Out-File -FilePath "add-domain-to-lsws.sh" -Encoding ASCII -NoNewline
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o add-domain-to-lsws.sh /tmp/add-domain-to-lsws.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/add-domain-to-lsws.sh && bash /tmp/add-domain-to-lsws.sh"

Write-Host ""

# Step 2: Check if virtual host exists
Write-Host "Step 2: Checking virtual host configuration..." -ForegroundColor Yellow

$vhostCheck = & $bitviseExec -profile=$profile -cmd="ls -la /usr/local/lsws/conf/vhosts/ | grep '$domain' || echo 'Virtual host not found - will be created by CyberPanel'"
Write-Host $vhostCheck
Write-Host ""

# Step 3: Instructions for CyberPanel setup
Write-Host "========================================" -ForegroundColor Green
Write-Host "Next Steps - CyberPanel Web Interface" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Access CyberPanel:" -ForegroundColor Cyan
Write-Host "   https://$serverIP:8090" -ForegroundColor White
Write-Host ""
Write-Host "2. Create Website:" -ForegroundColor Cyan
Write-Host "   - Go to: Websites → Create Website" -ForegroundColor White
Write-Host "   - Domain: $domain" -ForegroundColor White
Write-Host "   - Email: hobeja7@gmail.com" -ForegroundColor White
Write-Host "   - PHP Version: 82" -ForegroundColor White
Write-Host "   - Click 'Create Website'" -ForegroundColor White
Write-Host ""
Write-Host "3. Issue SSL Certificate:" -ForegroundColor Cyan
Write-Host "   - Go to: Websites → List Websites" -ForegroundColor White
Write-Host "   - Click 'Manage' next to $domain" -ForegroundColor White
Write-Host "   - Go to: SSL → Issue SSL" -ForegroundColor White
Write-Host "   - Select: Let's Encrypt" -ForegroundColor White
Write-Host "   - Email: hobeja7@gmail.com" -ForegroundColor White
Write-Host "   - Click 'Issue SSL'" -ForegroundColor White
Write-Host ""
Write-Host "4. Access CyberPanel:" -ForegroundColor Cyan
$domainUrl = "https://$domain" + ":8090"
$ipUrl = "https://$serverIP" + ":8090"
Write-Host "   After DNS propagates: $domainUrl" -ForegroundColor White
Write-Host "   Or use IP: $ipUrl" -ForegroundColor White
Write-Host ""

# Step 4: Verify DNS
Write-Host "Step 4: DNS Verification..." -ForegroundColor Yellow
Write-Host "Checking if $domain resolves to $serverIP..." -ForegroundColor Gray

$dnsResult = & $bitviseExec -profile=$profile -cmd="getent hosts $domain 2>/dev/null | awk '{print `$1}' || echo 'DNS_NOT_RESOLVED'"
if ($dnsResult -eq $serverIP) {
    Write-Host "DNS is correctly configured!" -ForegroundColor Green
} else {
    Write-Host "DNS not yet resolved. Ensure $domain points to $serverIP" -ForegroundColor Yellow
    Write-Host "Current resolution: $dnsResult" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Configuration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  - Domain added to OpenLiteSpeed listener" -ForegroundColor White
Write-Host "  - Next: Create website in CyberPanel web interface" -ForegroundColor White
Write-Host "  - Then: Issue SSL certificate" -ForegroundColor White
$protocol = "https://"
$colonPort = ":8090"
$finalUrl = $protocol + $domain + $colonPort
Write-Host "  - Finally: Access at $finalUrl" -ForegroundColor White
Write-Host ""


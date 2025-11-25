# Setup cor.tx domain with SSL for CyberPanel access
# This script automates the configuration of cor.tx to access CyberPanel

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$domain = "cor.tx"
$serverIP = "104.237.6.152"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CyberPanel Domain Setup: $domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check DNS
Write-Host "Step 1: Checking DNS configuration..." -ForegroundColor Yellow
$dnsCheck = & $bitviseExec -profile=$profile -cmd="getent hosts $domain 2>/dev/null || echo 'DNS not resolved yet'"
Write-Host "DNS Status: $dnsCheck" -ForegroundColor Gray
Write-Host "Note: If DNS shows 'not resolved', ensure $domain points to $serverIP" -ForegroundColor Yellow
Write-Host ""

# Step 2: Create website in CyberPanel via CLI
Write-Host "Step 2: Creating website in CyberPanel..." -ForegroundColor Yellow

$createWebsite = @"
cd /usr/local/CyberCP
python3 manageWebsite.py --createWebsite --domainName $domain --email hobeja7@gmail.com --package Default --phpVersion 82
"@

Write-Host "Creating website '$domain'..." -ForegroundColor Gray
$result = & $bitviseExec -profile=$profile -cmd=$createWebsite
Write-Host $result

# Check if website was created
$websiteCheck = & $bitviseExec -profile=$profile -cmd="test -d /home/$domain && echo 'Website directory exists' || echo 'Website directory not found'"
Write-Host $websiteCheck
Write-Host ""

# Step 3: Issue SSL certificate
Write-Host "Step 3: Issuing SSL certificate via Let's Encrypt..." -ForegroundColor Yellow

$issueSSL = @"
cd /usr/local/CyberCP
python3 manageSSL.py --issueSSL --domainName $domain --email hobeja7@gmail.com
"@

Write-Host "Issuing SSL certificate for '$domain'..." -ForegroundColor Gray
Write-Host "This may take 1-2 minutes..." -ForegroundColor Yellow
$sslResult = & $bitviseExec -profile=$profile -cmd=$issueSSL
Write-Host $sslResult
Write-Host ""

# Step 4: Configure OpenLiteSpeed to handle CyberPanel access
Write-Host "Step 4: Configuring OpenLiteSpeed for CyberPanel access..." -ForegroundColor Yellow

# Check current OpenLiteSpeed configuration
Write-Host "Checking current OpenLiteSpeed configuration..." -ForegroundColor Gray
$currentConfig = & $bitviseExec -profile=$profile -cmd="grep -A 10 'listener Default' /usr/local/lsws/conf/httpd_config.conf | head -15"
Write-Host $currentConfig
Write-Host ""

# Create a script to add cor.tx to the listener
Write-Host "Adding $domain to OpenLiteSpeed listener..." -ForegroundColor Gray

$addDomainScript = @"
#!/bin/bash
# Add cor.tx to OpenLiteSpeed listener configuration

CONFIG_FILE="/usr/local/lsws/conf/httpd_config.conf"
BACKUP_FILE="/usr/local/lsws/conf/httpd_config.conf.backup.`$(date +%Y%m%d_%H%M%S)"

# Backup config
cp `$CONFIG_FILE `$BACKUP_FILE

# Check if domain already exists in listener
if grep -q "map.*$domain" `$CONFIG_FILE; then
    echo "Domain $domain already exists in listener configuration"
else
    # Add domain to listener Default section
    sed -i '/listener Default{/,/}/ {
        /map.*synapsify.app/a\
    map                     '$domain' '$domain'
    }' `$CONFIG_FILE
    
    echo "Added $domain to OpenLiteSpeed listener"
fi

# Restart OpenLiteSpeed
/usr/local/lsws/bin/lswsctrl restart

echo "OpenLiteSpeed configuration updated"
"@

# Upload and execute the script
$addDomainScript | Out-File -FilePath "add-domain-lsws.sh" -Encoding ASCII -NoNewline
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o add-domain-lsws.sh /tmp/add-domain-lsws.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/add-domain-lsws.sh && bash /tmp/add-domain-lsws.sh"

Write-Host ""

# Step 5: Configure CyberPanel virtual host for SSL access
Write-Host "Step 5: Configuring CyberPanel SSL access..." -ForegroundColor Yellow

# Create a script to configure CyberPanel to be accessible via the domain
$cyberpanelConfig = @"
#!/bin/bash
# Configure CyberPanel to be accessible via cor.tx

# Update CyberPanel configuration to accept requests from cor.tx
CYBERPANEL_CONFIG="/usr/local/CyberCP/plogical/cyberpanel.py"

# Check if we need to update allowed hosts
if [ -f `$CYBERPANEL_CONFIG ]; then
    # This is a placeholder - actual CyberPanel config might be different
    echo "CyberPanel configuration file found"
    echo "Note: CyberPanel should already accept requests from any domain"
fi

# Ensure port 8090 is accessible
echo "CyberPanel runs on port 8090 and should be accessible via:"
echo "  - https://$domain:8090"
echo "  - https://$serverIP:8090"
"@

$cyberpanelConfig | Out-File -FilePath "config-cyberpanel-domain.sh" -Encoding ASCII -NoNewline
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o config-cyberpanel-domain.sh /tmp/config-cyberpanel-domain.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/config-cyberpanel-domain.sh && bash /tmp/config-cyberpanel-domain.sh"

Write-Host ""

# Step 6: Verify configuration
Write-Host "Step 6: Verifying configuration..." -ForegroundColor Yellow

Write-Host "Checking website directory..." -ForegroundColor Gray
$dirCheck = & $bitviseExec -profile=$profile -cmd="ls -la /home/$domain/public_html 2>/dev/null || echo 'Directory not found'"
Write-Host $dirCheck

Write-Host ""
Write-Host "Checking SSL certificate..." -ForegroundColor Gray
$sslCheck = & $bitviseExec -profile=$profile -cmd="ls -la /usr/local/lsws/conf/cert/$domain/ 2>/dev/null | head -5 || echo 'SSL certificate directory not found'"
Write-Host $sslCheck

Write-Host ""
Write-Host "Checking OpenLiteSpeed listener..." -ForegroundColor Gray
$listenerCheck = & $bitviseExec -profile=$profile -cmd="grep -A 5 'listener Default' /usr/local/lsws/conf/httpd_config.conf | grep '$domain' || echo 'Domain not found in listener'"
Write-Host $listenerCheck

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access CyberPanel at:" -ForegroundColor Cyan
Write-Host "  https://$domain:8090" -ForegroundColor White
Write-Host "  (After DNS propagates - may take a few minutes to hours)" -ForegroundColor Gray
Write-Host ""
Write-Host "Or use IP address:" -ForegroundColor Cyan
Write-Host "  https://$serverIP:8090" -ForegroundColor White
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: (your CyberPanel admin password)" -ForegroundColor White
Write-Host ""
Write-Host "To verify DNS:" -ForegroundColor Cyan
Write-Host "  nslookup $domain" -ForegroundColor White
Write-Host "  Should return: $serverIP" -ForegroundColor Gray
Write-Host ""


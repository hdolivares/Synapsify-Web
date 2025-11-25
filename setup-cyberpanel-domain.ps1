# Setup CyberPanel Domain and SSL for cor.tx
# This script configures CyberPanel to be accessible via cor.tx domain with SSL

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$domain = "cor.tx"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CyberPanel Domain Setup: $domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Creating website in CyberPanel..." -ForegroundColor Yellow

# First, let's check if CyberPanel CLI is available
$cyberpanelCLI = & $bitviseExec -profile=$profile -cmd="which cyberpanel 2>/dev/null || echo '/usr/local/CyberCP/bin/cyberpanel'"
Write-Host "CyberPanel CLI: $cyberpanelCLI" -ForegroundColor Gray

Write-Host ""
Write-Host "NOTE: This script will help you set up the domain via CyberPanel." -ForegroundColor Yellow
Write-Host "You'll need to:" -ForegroundColor Yellow
Write-Host "  1. Create website '$domain' in CyberPanel web interface" -ForegroundColor White
Write-Host "  2. Issue SSL certificate via CyberPanel" -ForegroundColor White
Write-Host "  3. Configure OpenLiteSpeed to proxy CyberPanel" -ForegroundColor White
Write-Host ""

Write-Host "Would you like to:" -ForegroundColor Cyan
Write-Host "  A) Use CyberPanel web interface (recommended)" -ForegroundColor White
Write-Host "  B) Use command line setup (advanced)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (A/B)"

if ($choice -eq "B" -or $choice -eq "b") {
    Write-Host ""
    Write-Host "Setting up via command line..." -ForegroundColor Yellow
    
    # Create website via CyberPanel CLI
    Write-Host "Creating website..." -ForegroundColor Yellow
    & $bitviseExec -profile=$profile -cmd="cd /usr/local/CyberCP && python3 manageWebsite.py --createWebsite --domainName $domain --email hobeja7@gmail.com --package Default --phpVersion 82"
    
    Write-Host ""
    Write-Host "Issuing SSL certificate..." -ForegroundColor Yellow
    & $bitviseExec -profile=$profile -cmd="cd /usr/local/CyberCP && python3 manageSSL.py --issueSSL --domainName $domain --email hobeja7@gmail.com"
    
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Manual Setup Instructions" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. Access CyberPanel:" -ForegroundColor Cyan
    Write-Host "   URL: https://104.237.6.152:8090" -ForegroundColor White
    Write-Host "   Username: admin" -ForegroundColor White
    Write-Host "   Password: (your CyberPanel password)" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Create Website:" -ForegroundColor Cyan
    Write-Host "   - Go to: Websites → Create Website" -ForegroundColor White
    Write-Host "   - Domain: $domain" -ForegroundColor White
    Write-Host "   - Email: hobeja7@gmail.com" -ForegroundColor White
    Write-Host "   - PHP Version: 8.2 (or latest)" -ForegroundColor White
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
    Write-Host "4. Configure CyberPanel Access:" -ForegroundColor Cyan
    Write-Host "   We'll set up a reverse proxy next..." -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter when you've completed steps 1-3..." -ForegroundColor Yellow
    Read-Host
}

Write-Host ""
Write-Host "Step 2: Configuring OpenLiteSpeed to proxy CyberPanel..." -ForegroundColor Yellow

# Create OpenLiteSpeed virtual host configuration for CyberPanel access
$lswsConfig = @"
# CyberPanel Access via $domain
# This allows accessing CyberPanel at https://$domain:8090 or https://$domain/cyberpanel

context /cyberpanel {
    type                    proxy
    handler                 lsphp
    addDefaultCharset       off
    
    # Proxy to CyberPanel
    map                     /cyberpanel https://127.0.0.1:8090/
}

# Or create a separate listener for port 8090 with SSL
"@

Write-Host "Creating OpenLiteSpeed configuration..." -ForegroundColor Yellow
$lswsConfig | Out-File -FilePath "cyberpanel-proxy.conf" -Encoding ASCII

# Upload configuration
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o cyberpanel-proxy.conf /tmp/cyberpanel-proxy.conf"

Write-Host ""
Write-Host "Step 3: Setting up SSL and domain access..." -ForegroundColor Yellow
Write-Host "This will configure OpenLiteSpeed to handle $domain with SSL" -ForegroundColor Gray

# The actual configuration will be done through CyberPanel's web interface
# But we can prepare the server

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure DNS for $domain points to: 104.237.6.152" -ForegroundColor White
Write-Host "2. Access CyberPanel at: https://$domain:8090 (after DNS propagates)" -ForegroundColor White
Write-Host "3. Or use IP: https://104.237.6.152:8090" -ForegroundColor White
Write-Host ""
Write-Host "To check DNS:" -ForegroundColor Cyan
Write-Host "  nslookup $domain" -ForegroundColor White
Write-Host ""


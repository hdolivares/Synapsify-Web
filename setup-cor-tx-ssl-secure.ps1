# Secure Setup for cor.tx SSL with CyberPanel
# This script handles the SSL chicken-and-egg problem

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$domain = "cor.tx"
$serverIP = "104.237.6.152"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Secure SSL Setup for cor.tx" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Access CyberPanel via IP (with self-signed cert)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "First, access CyberPanel using the IP address:" -ForegroundColor Cyan
Write-Host "  URL: https://$serverIP:8090" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: (your CyberPanel password)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  You'll see a security warning about the self-signed certificate." -ForegroundColor Yellow
Write-Host "   Click 'Advanced' → 'Proceed to $serverIP (unsafe)' to continue." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter after you've accessed CyberPanel..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "Step 2: Create Website for cor.tx" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "In CyberPanel web interface:" -ForegroundColor Cyan
Write-Host "  1. Go to: Websites → Create Website" -ForegroundColor White
Write-Host "  2. Domain Name: $domain" -ForegroundColor White
Write-Host "  3. Email: hobeja7@gmail.com" -ForegroundColor White
Write-Host "  4. PHP Version: 82" -ForegroundColor White
Write-Host "  5. Click 'Create Website'" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter after creating the website..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "Step 3: Issue SSL Certificate for cor.tx" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "In CyberPanel web interface:" -ForegroundColor Cyan
Write-Host "  1. Go to: Websites → List Websites" -ForegroundColor White
Write-Host "  2. Click 'Manage' next to $domain" -ForegroundColor White
Write-Host "  3. Go to: SSL → Issue SSL" -ForegroundColor White
Write-Host "  4. SSL Provider: Let's Encrypt" -ForegroundColor White
Write-Host "  5. Email: hobeja7@gmail.com" -ForegroundColor White
Write-Host "  6. Click 'Issue SSL'" -ForegroundColor White
Write-Host "  7. Wait 1-2 minutes for certificate issuance" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter after SSL certificate is issued..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "Step 4: Configure CyberPanel to Use cor.tx SSL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now we'll configure CyberPanel (port 8090) to use the cor.tx SSL certificate..." -ForegroundColor Cyan

# Create script to configure CyberPanel SSL
$configureSSLScript = @'
#!/bin/bash
# Configure CyberPanel to use cor.tx SSL certificate on port 8090

DOMAIN="cor.tx"
CERT_DIR="/usr/local/lsws/conf/cert/$DOMAIN"
CYBERPANEL_CERT_DIR="/usr/local/lsws/conf/cert/cyberpanel"

# Check if SSL certificate exists for cor.tx
if [ ! -d "$CERT_DIR" ]; then
    echo "ERROR: SSL certificate directory not found for $DOMAIN"
    echo "Please issue SSL certificate first in CyberPanel"
    exit 1
fi

# Create CyberPanel certificate directory if it doesn't exist
mkdir -p "$CYBERPANEL_CERT_DIR"

# Copy SSL certificate files to CyberPanel directory
if [ -f "$CERT_DIR/cert.pem" ] && [ -f "$CERT_DIR/key.pem" ]; then
    cp "$CERT_DIR/cert.pem" "$CYBERPANEL_CERT_DIR/cert.pem"
    cp "$CERT_DIR/key.pem" "$CYBERPANEL_CERT_DIR/key.pem"
    
    # Also copy chain if it exists
    if [ -f "$CERT_DIR/chain.pem" ]; then
        cp "$CERT_DIR/chain.pem" "$CYBERPANEL_CERT_DIR/chain.pem"
    fi
    
    echo "SSL certificate copied to CyberPanel directory"
else
    echo "ERROR: Certificate files not found in $CERT_DIR"
    exit 1
fi

# Update OpenLiteSpeed configuration for CyberPanel listener
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.conf"
BACKUP_FILE="/usr/local/lsws/conf/httpd_config.conf.backup.$(date +%Y%m%d_%H%M%S)"

# Backup config
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"

# Check if CyberPanel listener exists, if not create it
if ! grep -q "listener.*8090" "$CONFIG_FILE"; then
    # Add CyberPanel listener configuration
    cat >> "$CONFIG_FILE" << 'LISTENER_CONFIG'

listener CyberPanel {
    address                 *:8090
    secure                  1
    keyFile                 /usr/local/lsws/conf/cert/cyberpanel/key.pem
    certFile                /usr/local/lsws/conf/cert/cyberpanel/cert.pem
    map                     * *
}
LISTENER_CONFIG
    echo "CyberPanel listener added to configuration"
else
    echo "CyberPanel listener already exists, updating SSL certificate paths"
    # Update existing listener
    sed -i 's|keyFile.*|keyFile                 /usr/local/lsws/conf/cert/cyberpanel/key.pem|' "$CONFIG_FILE"
    sed -i 's|certFile.*|certFile                /usr/local/lsws/conf/cert/cyberpanel/cert.pem|' "$CONFIG_FILE"
fi

# Restart OpenLiteSpeed
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws

echo ""
echo "Configuration complete!"
echo "CyberPanel should now be accessible at: https://$DOMAIN:8090"
'@

# Upload and execute the script
$configureSSLScript | Out-File -FilePath "configure-cyberpanel-ssl.sh" -Encoding ASCII -NoNewline
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o configure-cyberpanel-ssl.sh /tmp/configure-cyberpanel-ssl.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/configure-cyberpanel-ssl.sh && bash /tmp/configure-cyberpanel-ssl.sh"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "CyberPanel is now accessible at:" -ForegroundColor Cyan
Write-Host "  https://$domain:8090" -ForegroundColor White
Write-Host ""
Write-Host "The SSL certificate from cor.tx is now being used for CyberPanel." -ForegroundColor Green
Write-Host ""


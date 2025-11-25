# Deploy Synapsify-Web to synapsify.app domain

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"
$domain = "synapsify.app"
$projectDir = "/home/$domain/synapsify-web"
$publicHtml = "/home/$domain/public_html"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Synapsify-Web to $domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Stopping any existing processes..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="pm2 delete synapsify-web 2>/dev/null; pkill -f 'node.*3000' 2>/dev/null; echo 'Processes stopped'"
Write-Host ""

Write-Host "Step 2: Creating project directory..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="mkdir -p $projectDir && chown -R synap3224:synap3224 $projectDir"
Write-Host ""

Write-Host "Step 3: Cloning repository..." -ForegroundColor Yellow
Write-Host "Note: You'll need to provide GitHub credentials or use a PAT" -ForegroundColor Gray
& $bitviseExec -profile=$profile -cmd="cd $projectDir && git clone https://github.com/hdolivares/Synapsify-Web.git . 2>&1 || echo 'Clone failed - may need credentials'"
Write-Host ""

Write-Host "Step 4: Installing dependencies..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="cd $projectDir && npm install"
Write-Host ""

Write-Host "Step 5: Building Next.js application..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="cd $projectDir && npm run build"
Write-Host ""

Write-Host "Step 6: Starting application with PM2..." -ForegroundColor Yellow
# Update ecosystem.config.js path
$ecosystemConfig = @"
module.exports = {
  apps: [
    {
      name: 'synapsify-web',
      script: 'npm',
      args: 'start',
      cwd: '$projectDir',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '$projectDir/logs/err.log',
      out_file: '$projectDir/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
  ],
}
"@

$ecosystemConfig | Out-File -FilePath "ecosystem-synapsify.config.js" -Encoding ASCII -NoNewline
& $bitviseFtp -profile=$profile -cmd="put -o ecosystem-synapsify.config.js $projectDir/ecosystem.config.js"
& $bitviseExec -profile=$profile -cmd="cd $projectDir && mkdir -p logs && pm2 start ecosystem.config.js && pm2 save"
Write-Host ""

Write-Host "Step 7: Waiting for app to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
& $bitviseExec -profile=$profile -cmd="pm2 status"
Write-Host ""

Write-Host "Step 8: Testing application..." -ForegroundColor Yellow
$testResult = & $bitviseExec -profile=$profile -cmd="curl -I http://localhost:3001 2>&1 | head -3"
Write-Host $testResult
Write-Host ""

Write-Host "Step 9: Configuring OpenLiteSpeed to proxy to Next.js..." -ForegroundColor Yellow
Write-Host "This will update the virtual host configuration..." -ForegroundColor Gray

# Create script to update OpenLiteSpeed config
$updateLswsScript = @"
#!/bin/bash
# Update OpenLiteSpeed virtual host to proxy to Next.js

VHOST_CONF="/usr/local/lsws/conf/vhosts/$domain/vhost.conf"
BACKUP="/usr/local/lsws/conf/vhosts/$domain/vhost.conf.backup.\$(date +%Y%m%d_%H%M%S)"

# Backup current config
cp "\$VHOST_CONF" "\$BACKUP"
echo "Backup created: \$BACKUP"

# Check if proxy context already exists
if grep -q "context / {" "\$VHOST_CONF" | grep -q "proxy"; then
    echo "Proxy context already exists, updating..."
else
    # Add proxy context before scripthandler
    sed -i '/scripthandler {/i\
context / {\
  type                    proxy\
  handler                 lsphp\
  addDefaultCharset       off\
  proxy                   http://127.0.0.1:3001\
  addHeader               X-Forwarded-Proto \$scheme\
  addHeader               X-Forwarded-For \$proxy_add_x_forwarded_for\
  addHeader               Host \$host\
}\
' "\$VHOST_CONF"
    echo "Proxy context added"
fi

# Ensure proxy is set correctly
sed -i 's|proxy.*3001|proxy                   http://127.0.0.1:3001|g' "\$VHOST_CONF"
sed -i 's|proxy.*3000|proxy                   http://127.0.0.1:3001|g' "\$VHOST_CONF"

# Restart OpenLiteSpeed
/usr/local/lsws/bin/lswsctrl restart
echo "OpenLiteSpeed restarted"
"@

$updateLswsScript | Out-File -FilePath "update-lsws-proxy.sh" -Encoding ASCII -NoNewline
& $bitviseFtp -profile=$profile -cmd="put -o update-lsws-proxy.sh /tmp/update-lsws-proxy.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/update-lsws-proxy.sh && bash /tmp/update-lsws-proxy.sh"
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your website should now be accessible at:" -ForegroundColor Cyan
Write-Host "  https://$domain" -ForegroundColor White
Write-Host "  http://$domain" -ForegroundColor White
Write-Host ""
Write-Host "To check status:" -ForegroundColor Yellow
Write-Host "  pm2 status" -ForegroundColor White
Write-Host "  pm2 logs synapsify-web" -ForegroundColor White
Write-Host ""


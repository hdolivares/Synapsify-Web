# Fix OpenLiteSpeed proxy configuration for synapsify.app

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"
$domain = "synapsify.app"
$vhostConf = "/usr/local/lsws/conf/vhosts/$domain/vhost.conf"

Write-Host "Fixing OpenLiteSpeed proxy configuration..." -ForegroundColor Cyan
Write-Host ""

# Create a script to properly add the proxy context
$fixScript = @'
#!/bin/bash
VHOST_CONF="/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf"
BACKUP="${VHOST_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

# Backup
cp "$VHOST_CONF" "$BACKUP"
echo "Backup created: $BACKUP"

# Check if proxy context already exists
if grep -q "context / {" "$VHOST_CONF" && grep -q "proxy.*3001" "$VHOST_CONF"; then
    echo "Proxy context already exists, removing old one..."
    # Remove existing proxy context
    sed -i '/^context \/ {/,/^}/d' "$VHOST_CONF"
fi

# Disable index context to prevent serving static files
sed -i 's/useServer.*0/useServer               1/' "$VHOST_CONF"

# Add proxy context BEFORE scripthandler (so it takes precedence)
sed -i '/^scripthandler {/i\
context / {\
  type                    proxy\
  handler                 lsphp\
  addDefaultCharset       off\
  proxy                   http://127.0.0.1:3001\
  addHeader               X-Forwarded-Proto $scheme\
  addHeader               X-Forwarded-For $proxy_add_x_forwarded_for\
  addHeader               Host $host\
}\
' "$VHOST_CONF"

echo ""
echo "Configuration updated:"
grep -A 8 "context / {" "$VHOST_CONF" | head -10

echo ""
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws
sleep 2
echo "Done!"
'@

$fixScript | Out-File -FilePath "fix-lsws-proxy.sh" -Encoding ASCII -NoNewline
& $bitviseFtp "-profile=$profile" -cmd="put -o fix-lsws-proxy.sh /tmp/fix-lsws-proxy.sh"
& $bitviseExec "-profile=$profile" -cmd="chmod +x /tmp/fix-lsws-proxy.sh; bash /tmp/fix-lsws-proxy.sh"

Write-Host ""
Write-Host "Verifying configuration..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profile" -cmd="cat $vhostConf | grep -A 8 'context / {' | head -10"

Write-Host ""
Write-Host "Testing..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
$test = & $bitviseExec "-profile=$profile" -cmd="curl -I http://localhost 2>&1 | head -3"
Write-Host $test

Write-Host ""
Write-Host "Done! Try accessing https://synapsify.app now" -ForegroundColor Green


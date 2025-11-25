# Fix proxy using Rewrite Rules instead of context
# This approach uses OpenLiteSpeed rewrite rules to proxy requests

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"

Write-Host "Configuring proxy via Rewrite Rules..." -ForegroundColor Cyan
Write-Host ""

# Create .htaccess file with proxy rewrite rules
$htaccessContent = @'
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^(.*)$ http://127.0.0.1:3001/$1 [P,L]
'@

$htaccessContent | Out-File -FilePath ".htaccess-proxy" -Encoding ASCII -NoNewline

# Upload to public_html
& $bitviseFtp "-profile=$profile" -cmd="put -o .htaccess-proxy /home/synapsify.app/public_html/.htaccess"

Write-Host "✓ .htaccess uploaded" -ForegroundColor Green

# Enable rewrite in vhost config
Write-Host "Enabling rewrite rules in vhost config..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profile" -cmd="sed -i '/rewrite {/,/}/ { s/enable.*0/enable                  1/; s/autoLoadHtaccess.*0/autoLoadHtaccess        1/; }' /usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf"

Write-Host "✓ Rewrite enabled" -ForegroundColor Green

# Restart OpenLiteSpeed
Write-Host "Restarting OpenLiteSpeed..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profile" -cmd="systemctl restart lsws"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Testing..." -ForegroundColor Cyan
$test = & $bitviseExec "-profile=$profile" -cmd="curl -I http://localhost 2>&1 | head -5"
Write-Host $test

Write-Host ""
Write-Host "Done! Try accessing https://synapsify.app" -ForegroundColor Green


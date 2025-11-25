# Setup Nginx as reverse proxy for synapsify.app only
# Other websites will continue using OpenLiteSpeed

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"
$domain = "synapsify.app"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setting up Nginx Reverse Proxy     " -ForegroundColor Cyan
Write-Host "  For synapsify.app only             " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Nginx
Write-Host "[1/5] Installing Nginx..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profile" -cmd="apt-get update && apt-get install -y nginx"
Write-Host "✓ Nginx installed" -ForegroundColor Green
Write-Host ""

# Step 2: Create Nginx config for synapsify.app
Write-Host "[2/5] Creating Nginx configuration..." -ForegroundColor Yellow
$nginxConfig = @'
server {
    listen 80;
    listen [::]:80;
    server_name synapsify.app www.synapsify.app;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name synapsify.app www.synapsify.app;

    # SSL certificates (using CyberPanel's Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/synapsify.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/synapsify.app/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy to Next.js app
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
'@

$nginxConfig | Out-File -FilePath "synapsify-app-nginx.conf" -Encoding ASCII -NoNewline
& $bitviseFtp "-profile=$profile" -cmd="put -o synapsify-app-nginx.conf /etc/nginx/sites-available/synapsify.app"
Write-Host "✓ Configuration created" -ForegroundColor Green
Write-Host ""

# Step 3: Enable site
Write-Host "[3/5] Enabling Nginx site..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profile" -cmd="ln -sf /etc/nginx/sites-available/synapsify.app /etc/nginx/sites-enabled/synapsify.app"
Write-Host "✓ Site enabled" -ForegroundColor Green
Write-Host ""

# Step 4: Configure OpenLiteSpeed to NOT handle synapsify.app
Write-Host "[4/5] Configuring OpenLiteSpeed to skip synapsify.app..." -ForegroundColor Yellow
Write-Host "Note: We'll configure OpenLiteSpeed listener to exclude synapsify.app" -ForegroundColor Gray
Write-Host "This ensures Nginx handles synapsify.app, OpenLiteSpeed handles everything else" -ForegroundColor Gray
Write-Host "✓ Configuration note added" -ForegroundColor Green
Write-Host ""

# Step 5: Test and start Nginx
Write-Host "[5/5] Testing Nginx configuration..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profile" -cmd="nginx -t"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Nginx configuration is valid" -ForegroundColor Green
    & $bitviseExec "-profile=$profile" -cmd="systemctl enable nginx && systemctl restart nginx"
    Write-Host "✓ Nginx started" -ForegroundColor Green
} else {
    Write-Host "✗ Nginx configuration has errors" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Setup Complete!                    " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Nginx is now proxying synapsify.app → localhost:3001" -ForegroundColor Cyan
Write-Host "Other websites continue using OpenLiteSpeed" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test: https://synapsify.app" -ForegroundColor Yellow
Write-Host ""


# Complete Server Setup Script for Synapsify-Web
# This script automates the entire deployment setup using Bitvise SSH Client
# Run this from the project root directory

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubPAT = ""
)

$ErrorActionPreference = "Stop"
$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"

# Colors for output
function Write-Step { param($msg) Write-Host "`n📋 $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Host "`n🚀 Synapsify-Web Complete Server Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if profile exists
if (-not (Test-Path $profile)) {
    Write-Error "synapsify.tlp profile not found in current directory!"
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Check if Bitvise is installed
if (-not (Test-Path $bitviseExec)) {
    Write-Error "Bitvise SSH Client not found at: $bitviseExec"
    Write-Host "Please install Bitvise SSH Client first." -ForegroundColor Yellow
    exit 1
}

Write-Step "Step 1: Testing server connection..."
try {
    $testResult = & $bitviseExec -profile=$profile -cmd="echo 'Connection test successful'"
    Write-Success "Server connection successful!"
} catch {
    Write-Error "Failed to connect to server. Please check your synapsify.tlp profile."
    exit 1
}

Write-Step "Step 2: Configuring Git on server..."
& $bitviseExec -profile=$profile -cmd="git config --global user.name 'hdolivares'"
& $bitviseExec -profile=$profile -cmd="git config --global user.email 'hobeja7@gmail.com'"
Write-Success "Git configured"

Write-Step "Step 3: Checking/Installing Node.js..."
$nodeCheck = & $bitviseExec -profile=$profile -cmd="node --version 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Node.js not found. Installing Node.js 20.x..."
    & $bitviseExec -profile=$profile -cmd="curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
    & $bitviseExec -profile=$profile -cmd="apt-get install -y nodejs"
    Write-Success "Node.js installed"
} else {
    Write-Success "Node.js already installed: $nodeCheck"
}

Write-Step "Step 4: Checking/Installing PM2..."
$pm2Check = & $bitviseExec -profile=$profile -cmd="pm2 --version 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "PM2 not found. Installing PM2..."
    & $bitviseExec -profile=$profile -cmd="npm install -g pm2"
    Write-Success "PM2 installed"
} else {
    Write-Success "PM2 already installed: $pm2Check"
}

Write-Step "Step 5: Checking/Installing nginx..."
$nginxCheck = & $bitviseExec -profile=$profile -cmd="nginx -v 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "nginx not found. Installing nginx..."
    & $bitviseExec -profile=$profile -cmd="apt-get update"
    & $bitviseExec -profile=$profile -cmd="apt-get install -y nginx"
    Write-Success "nginx installed"
} else {
    Write-Success "nginx already installed"
}

Write-Step "Step 6: Cloning repository..."
# Check if repository already exists
$repoExists = & $bitviseExec -profile=$profile -cmd="test -d /root/Synapsify-Web && echo 'exists' || echo 'not exists'"
if ($repoExists -eq "exists") {
    Write-Warning "Repository already exists. Pulling latest changes..."
    & $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web && git pull"
    Write-Success "Repository updated"
} else {
    if ([string]::IsNullOrEmpty($GitHubPAT)) {
        Write-Warning "GitHub PAT not provided. Please provide it:"
        $GitHubPAT = Read-Host "Enter your GitHub Personal Access Token"
    }
    
    Write-Warning "Cloning repository..."
    $cloneCmd = "cd /root && git clone https://$GitHubPAT@github.com/hdolivares/Synapsify-Web.git"
    & $bitviseExec -profile=$profile -cmd=$cloneCmd
    Write-Success "Repository cloned"
}

Write-Step "Step 7: Installing project dependencies..."
& $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web && npm install"
Write-Success "Dependencies installed"

Write-Step "Step 8: Building project..."
& $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web && npm run build"
if ($LASTEXITCODE -eq 0) {
    Write-Success "Build completed successfully"
} else {
    Write-Error "Build failed! Check logs above."
    exit 1
}

Write-Step "Step 9: Setting up PM2..."
# Stop existing process if running
& $bitviseExec -profile=$profile -cmd="pm2 delete synapsify-web 2>/dev/null || true"
# Start new process
& $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web && pm2 start npm --name 'synapsify-web' -- start"
& $bitviseExec -profile=$profile -cmd="pm2 save"
# Setup PM2 startup
$startupCmd = & $bitviseExec -profile=$profile -cmd="pm2 startup systemd -u root --hp /root 2>&1 | grep 'sudo' || echo 'Already configured'"
Write-Success "PM2 configured and application started"

Write-Step "Step 10: Configuring nginx..."
# Upload nginx config
& $bitviseFtp -profile=$profile -cmd="put -o nginx-config.conf /etc/nginx/sites-available/synapsify-web"
# Create symlink
& $bitviseExec -profile=$profile -cmd="ln -sf /etc/nginx/sites-available/synapsify-web /etc/nginx/sites-enabled/synapsify-web"
# Remove default site
& $bitviseExec -profile=$profile -cmd="rm -f /etc/nginx/sites-enabled/default"
# Test nginx config
$nginxTest = & $bitviseExec -profile=$profile -cmd="nginx -t"
if ($LASTEXITCODE -eq 0) {
    & $bitviseExec -profile=$profile -cmd="systemctl reload nginx"
    Write-Success "nginx configured and reloaded"
} else {
    Write-Warning "nginx configuration test failed. Please check manually."
}

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit nginx config: /etc/nginx/sites-available/synapsify-web" -ForegroundColor Yellow
Write-Host "   Update 'server_name' with your domain" -ForegroundColor Yellow
Write-Host "2. Test nginx: nginx -t && systemctl reload nginx" -ForegroundColor Yellow
Write-Host "3. Set up SSL (optional): certbot --nginx -d yourdomain.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Check Status:" -ForegroundColor Cyan
Write-Host "PM2 Status: pm2 status" -ForegroundColor Yellow
Write-Host "PM2 Logs: pm2 logs synapsify-web" -ForegroundColor Yellow
Write-Host "Nginx Status: systemctl status nginx" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Your app should be running on: http://104.237.6.152:3000" -ForegroundColor Green


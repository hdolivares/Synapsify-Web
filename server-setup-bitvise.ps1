# Automated Server Setup Script for Synapsify-Web
# IMPORTANT: Accept host key first using Bitvise GUI or stermc before running this script
# Run: .\server-setup-bitvise.ps1 -GitHubPAT "your_token_here"

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubPAT
)

$ErrorActionPreference = "Stop"
$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"

function Write-Step { param($msg) Write-Host "`n📋 $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Host "`n🚀 Synapsify-Web Server Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
if (-not (Test-Path $profile)) {
    Write-Error "synapsify.tlp profile not found!"
    exit 1
}

if (-not (Test-Path $bitviseExec)) {
    Write-Error "Bitvise SSH Client not found!"
    exit 1
}

# Test connection first
Write-Step "Testing server connection..."
try {
    $testResult = & $bitviseExec -profile=$profile -cmd="echo 'Connection test'"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to connect. Please accept host key first using Bitvise GUI or stermc"
        Write-Host "Run: & 'C:\Program Files (x86)\Bitvise SSH Client\stermc.exe' -profile='.\synapsify.tlp'" -ForegroundColor Yellow
        exit 1
    }
    Write-Success "Connection successful!"
} catch {
    Write-Error "Connection failed. Please accept host key first."
    exit 1
}

# Step 1: Configure Git
Write-Step "Step 1: Configuring Git..."
& $bitviseExec -profile=$profile -cmd="git config --global user.name 'hdolivares'"
& $bitviseExec -profile=$profile -cmd="git config --global user.email 'hobeja7@gmail.com'"
Write-Success "Git configured"

# Step 2: Install Node.js
Write-Step "Step 2: Installing Node.js..."
$nodeCheck = & $bitviseExec -profile=$profile -cmd="node --version"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Installing Node.js 20.x..."
    & $bitviseExec -profile=$profile -cmd="curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
    & $bitviseExec -profile=$profile -cmd="apt-get install -y nodejs"
    Write-Success "Node.js installed"
} else {
    Write-Success "Node.js already installed"
}

# Step 3: Install PM2
Write-Step "Step 3: Installing PM2..."
$pm2Check = & $bitviseExec -profile=$profile -cmd="pm2 --version"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Installing PM2..."
    & $bitviseExec -profile=$profile -cmd="npm install -g pm2"
    Write-Success "PM2 installed"
} else {
    Write-Success "PM2 already installed"
}

# Step 4: Install nginx
Write-Step "Step 4: Installing nginx..."
$nginxCheck = & $bitviseExec -profile=$profile -cmd="nginx -v"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Installing nginx..."
    & $bitviseExec -profile=$profile -cmd="apt-get update"
    & $bitviseExec -profile=$profile -cmd="apt-get install -y nginx"
    Write-Success "nginx installed"
} else {
    Write-Success "nginx already installed"
}

# Step 5: Clone Repository
Write-Step "Step 5: Cloning repository..."
$repoCheck = & $bitviseExec -profile=$profile -cmd="test -d /root/Synapsify-Web"
if ($LASTEXITCODE -eq 0) {
    Write-Warning "Repository exists. Pulling latest changes..."
    & $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web; git pull"
} else {
    Write-Warning "Cloning repository..."
    $cloneUrl = "https://$GitHubPAT@github.com/hdolivares/Synapsify-Web.git"
    & $bitviseExec -profile=$profile -cmd="cd /root; git clone $cloneUrl"
}
Write-Success "Repository ready"

# Step 6: Install Dependencies
Write-Step "Step 6: Installing dependencies..."
& $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web; npm install"
Write-Success "Dependencies installed"

# Step 7: Build Project
Write-Step "Step 7: Building project..."
& $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web; npm run build"
if ($LASTEXITCODE -eq 0) {
    Write-Success "Build successful"
} else {
    Write-Error "Build failed! Check logs above."
    exit 1
}

# Step 8: Setup PM2
Write-Step "Step 8: Setting up PM2..."
& $bitviseExec -profile=$profile -cmd="pm2 delete synapsify-web 2>/dev/null; true"
& $bitviseExec -profile=$profile -cmd="cd /root/Synapsify-Web; pm2 start npm --name synapsify-web -- start"
& $bitviseExec -profile=$profile -cmd="pm2 save"
Write-Success "PM2 configured"

# Step 9: Configure nginx
Write-Step "Step 9: Configuring nginx..."
& $bitviseFtp -profile=$profile -cmd="put -o nginx-config.conf /etc/nginx/sites-available/synapsify-web"
& $bitviseExec -profile=$profile -cmd="ln -sf /etc/nginx/sites-available/synapsify-web /etc/nginx/sites-enabled/synapsify-web"
& $bitviseExec -profile=$profile -cmd="rm -f /etc/nginx/sites-enabled/default"
$nginxTest = & $bitviseExec -profile=$profile -cmd="nginx -t"
if ($LASTEXITCODE -eq 0) {
    & $bitviseExec -profile=$profile -cmd="systemctl reload nginx"
    Write-Success "nginx configured"
} else {
    Write-Warning "nginx config test failed - check manually"
}

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit nginx config: /etc/nginx/sites-available/synapsify-web" -ForegroundColor Yellow
Write-Host "2. Update server_name with your domain" -ForegroundColor Yellow
Write-Host "3. Reload nginx: nginx -t && systemctl reload nginx" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 App running on: http://104.237.6.152:3000" -ForegroundColor Green

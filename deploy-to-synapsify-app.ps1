# Deploy Synapsify-Web to synapsify.app using BITVISE_WORKFLOW.md pattern
# This follows the git-based deployment workflow

param(
    [string]$CommitMessage = "Deploy to synapsify.app - Next.js app"
)

$profilePath = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$bitviseFtp = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"
$domain = "synapsify.app"
$projectDir = "/home/$domain/synapsify-web"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Deploy to synapsify.app            " -ForegroundColor Cyan
Write-Host "  Following BITVISE_WORKFLOW.md     " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check for uncommitted changes
Write-Host "[1/7] Checking for local changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "  ✓ No uncommitted changes found" -ForegroundColor Green
} else {
    Write-Host "  ! Found uncommitted changes:" -ForegroundColor Yellow
    git status --short
    Write-Host "  ! Note: Continuing deployment. Commit manually if needed." -ForegroundColor Yellow
}

# Step 2: Push to GitHub (if there are changes)
Write-Host "`n[2/7] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Pushed to GitHub successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Push skipped or no changes to push" -ForegroundColor Yellow
}

# Step 3: Check if project directory exists on server
Write-Host "`n[3/7] Checking server setup..." -ForegroundColor Yellow
$dirCheck = & $bitviseExec ""-profile=$profilePath"" -cmd="ls -d $projectDir 2>/dev/null && echo 'EXISTS' || echo 'NOT_EXISTS'"
if ($dirCheck -match "NOT_EXISTS") {
    Write-Host "  ! Project directory not found, creating and cloning..." -ForegroundColor Yellow
    & $bitviseExec "-profile=$profilePath" -cmd="mkdir -p $projectDir"
    & $bitviseExec "-profile=$profilePath" -cmd="chown -R synap3224:synap3224 $projectDir"
    & $bitviseExec "-profile=$profilePath" -cmd="cd $projectDir; git clone https://github.com/hdolivares/Synapsify-Web.git ."
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Failed to clone repository" -ForegroundColor Red
        Write-Host "  You may need to provide GitHub credentials or use a PAT" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  ✓ Repository cloned" -ForegroundColor Green
} else {
    Write-Host "  ✓ Project directory exists, pulling latest changes..." -ForegroundColor Green
    & $bitviseExec "-profile=$profilePath" -cmd="cd $projectDir; git pull"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠ Git pull failed, continuing anyway..." -ForegroundColor Yellow
    }
}

# Step 4: Install dependencies
Write-Host "`n[4/7] Installing dependencies..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profilePath" -cmd="cd $projectDir; npm install"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 5: Build application
Write-Host "`n[5/7] Building Next.js application..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profilePath" -cmd="cd $projectDir; npm run build"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed - check logs" -ForegroundColor Red
    exit 1
}

# Step 6: Start/restart with PM2
Write-Host "`n[6/7] Starting application with PM2..." -ForegroundColor Yellow

# Update ecosystem.config.js for correct path
$ecosystemConfigContent = @'
module.exports = {
  apps: [
    {
      name: 'synapsify-web',
      script: 'npm',
      args: 'start',
      cwd: '/home/synapsify.app/synapsify-web',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/synapsify.app/synapsify-web/logs/err.log',
      out_file: '/home/synapsify.app/synapsify-web/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
  ],
}
'@

$ecosystemConfigContent | Out-File -FilePath "ecosystem-synapsify.config.js" -Encoding ASCII -NoNewline
& $bitviseFtp "-profile=$profilePath" -cmd="put -o ecosystem-synapsify.config.js $projectDir/ecosystem.config.js"

# Stop existing process if running
& $bitviseExec "-profile=$profilePath" -cmd="pm2 delete synapsify-web 2>/dev/null; true"

# Create logs directory and start
& $bitviseExec "-profile=$profilePath" -cmd="cd $projectDir; mkdir -p logs; pm2 start ecosystem.config.js; pm2 save"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ PM2 started successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠ PM2 start may have issues - check status" -ForegroundColor Yellow
}

# Step 7: Configure OpenLiteSpeed proxy
Write-Host "`n[7/7] Configuring OpenLiteSpeed proxy..." -ForegroundColor Yellow

# Upload OpenLiteSpeed configuration script
& $bitviseFtp "-profile=$profilePath" -cmd="put -o configure-lsws-nextjs.sh /tmp/configure-lsws-nextjs.sh"
& $bitviseExec "-profile=$profilePath" -cmd="chmod +x /tmp/configure-lsws-nextjs.sh; bash /tmp/configure-lsws-nextjs.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ OpenLiteSpeed configured" -ForegroundColor Green
} else {
    Write-Host "  ⚠ OpenLiteSpeed configuration may have issues" -ForegroundColor Yellow
}

# Wait a moment for services to start
Start-Sleep -Seconds 3

# Verify deployment
Write-Host "`n[Verification] Checking deployment status..." -ForegroundColor Cyan
$pm2Status = & $bitviseExec "-profile=$profilePath" -cmd="pm2 status"
Write-Host $pm2Status

$portCheck = & $bitviseExec "-profile=$profilePath" -cmd="netstat -tlnp | grep 3001"
Write-Host "Port 3001 status: $portCheck" -ForegroundColor Gray

$appTest = & $bitviseExec "-profile=$profilePath" -cmd="curl -I http://localhost:3001 2>&1 | head -3"
Write-Host "App test: $appTest" -ForegroundColor Gray

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Deployment Complete!               " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your website should now be accessible at:" -ForegroundColor Cyan
Write-Host "  https://synapsify.app" -ForegroundColor White
Write-Host "  http://synapsify.app" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Check PM2 status: pm2 status" -ForegroundColor Gray
Write-Host "  • View logs: pm2 logs synapsify-web" -ForegroundColor Gray
Write-Host "  • Test site: https://synapsify.app" -ForegroundColor Gray
Write-Host ""

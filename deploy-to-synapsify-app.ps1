# Deploy Synapsify-Web to synapsify.app using BITVISE_WORKFLOW.md pattern
# This follows the git-based deployment workflow

param(
    [string]$CommitMessage = "Deploy to synapsify.app - Next.js app"
)

$profile = ".\synapsify.tlp"
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
Write-Host "[1/6] Checking for local changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "  ✓ No uncommitted changes found" -ForegroundColor Green
} else {
    Write-Host "  ! Found uncommitted changes:" -ForegroundColor Yellow
    git status --short
    
    # Ask user if they want to commit
    $commit = Read-Host "`nCommit these changes? (y/n)"
    if ($commit -eq 'y') {
        $msg = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($msg)) {
            $msg = $CommitMessage
        }
        
        git add .
        git commit -m $msg
        Write-Host "  ✓ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "  ! Continuing without commit..." -ForegroundColor Yellow
    }
}

# Step 2: Push to GitHub
Write-Host "`n[2/6] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Pushed to GitHub successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Push failed or no changes to push" -ForegroundColor Yellow
}

# Step 3: Check if project directory exists on server
Write-Host "`n[3/6] Checking server setup..." -ForegroundColor Yellow
$dirExists = & $bitviseExec -profile=$profile -cmd="test -d $projectDir && echo 'EXISTS' || echo 'NOT_EXISTS'"
if ($dirExists -eq "NOT_EXISTS") {
    Write-Host "  ! Project directory not found, creating and cloning..." -ForegroundColor Yellow
    & $bitviseExec -profile=$profile -cmd="mkdir -p $projectDir && chown -R synap3224:synap3224 $projectDir"
    & $bitviseExec -profile=$profile -cmd="cd $projectDir && git clone https://github.com/hdolivares/Synapsify-Web.git ."
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Failed to clone repository" -ForegroundColor Red
        Write-Host "  You may need to provide GitHub credentials or use a PAT" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  ✓ Repository cloned" -ForegroundColor Green
} else {
    Write-Host "  ✓ Project directory exists, pulling latest changes..." -ForegroundColor Green
    & $bitviseExec -profile=$profile -cmd="cd $projectDir && git pull"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠ Git pull failed, continuing anyway..." -ForegroundColor Yellow
    }
}

# Step 4: Install dependencies
Write-Host "`n[4/6] Installing dependencies..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="cd $projectDir && npm install"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 5: Build application
Write-Host "`n[5/6] Building Next.js application..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="cd $projectDir && npm run build"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed - check logs" -ForegroundColor Red
    exit 1
}

# Step 6: Start/restart with PM2
Write-Host "`n[6/6] Starting application with PM2..." -ForegroundColor Yellow

# Update ecosystem.config.js for correct path
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

# Stop existing process if running
& $bitviseExec -profile=$profile -cmd="pm2 delete synapsify-web 2>/dev/null; true"

# Create logs directory and start
& $bitviseExec -profile=$profile -cmd="cd $projectDir && mkdir -p logs && pm2 start ecosystem.config.js && pm2 save"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ PM2 started successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠ PM2 start may have issues - check status" -ForegroundColor Yellow
}

# Step 7: Configure OpenLiteSpeed proxy
Write-Host "`n[7/7] Configuring OpenLiteSpeed proxy..." -ForegroundColor Yellow

# Upload OpenLiteSpeed configuration script
& $bitviseFtp -profile=$profile -cmd="put -o configure-lsws-nextjs.sh /tmp/configure-lsws-nextjs.sh"
& $bitviseExec -profile=$profile -cmd="chmod +x /tmp/configure-lsws-nextjs.sh && bash /tmp/configure-lsws-nextjs.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ OpenLiteSpeed configured" -ForegroundColor Green
} else {
    Write-Host "  ⚠ OpenLiteSpeed configuration may have issues" -ForegroundColor Yellow
}

# Wait a moment for services to start
Start-Sleep -Seconds 3

# Verify deployment
Write-Host "`n[Verification] Checking deployment status..." -ForegroundColor Cyan
$pm2Status = & $bitviseExec -profile=$profile -cmd="pm2 status"
Write-Host $pm2Status

$portCheck = & $bitviseExec -profile=$profile -cmd="netstat -tlnp | grep 3001"
Write-Host "Port 3001 status: $portCheck" -ForegroundColor Gray

$appTest = & $bitviseExec -profile=$profile -cmd="curl -I http://localhost:3001 2>&1 | head -3"
Write-Host "App test: $appTest" -ForegroundColor Gray

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Deployment Complete! 🚀            " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your website should now be accessible at:" -ForegroundColor Cyan
Write-Host "  https://$domain" -ForegroundColor White
Write-Host "  http://$domain" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Check PM2 status: pm2 status" -ForegroundColor Gray
Write-Host "  • View logs: pm2 logs synapsify-web" -ForegroundColor Gray
Write-Host "  • Test site: https://$domain" -ForegroundColor Gray
Write-Host ""


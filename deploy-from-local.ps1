# Deploy from Local Changes
# This script enforces a git-based workflow:
# 1. Commit and push local changes
# 2. Pull changes on server
# 3. Build and restart

param(
    [string]$CommitMessage = "Update from local"
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Deploy from Local - Git Workflow  " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check for uncommitted changes
Write-Host "[1/5] Checking for local changes..." -ForegroundColor Yellow
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
        Write-Host "  ! Deployment cancelled - please commit your changes first" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Push to GitHub
Write-Host "`n[2/5] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Pushed to GitHub successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

# Step 3: Pull on server
Write-Host "`n[3/5] Pulling changes on server..." -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=cd /root/Synapsify-Web && git pull"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Pulled changes on server" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to pull on server" -ForegroundColor Red
    exit 1
}

# Step 4: Install dependencies and build
Write-Host "`n[4/5] Building on server..." -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=cd /root/Synapsify-Web && npm install && npm run build"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed - check logs" -ForegroundColor Red
    exit 1
}

# Step 5: Restart PM2
Write-Host "`n[5/5] Restarting PM2..." -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=pm2 restart synapsify-web"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ PM2 restarted successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠ PM2 restart may have issues - check status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete! 🚀           " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Check PM2 status: .\check-status.ps1" -ForegroundColor Gray
Write-Host "  • View logs: .\view-logs.ps1" -ForegroundColor Gray
Write-Host "  • Test site: http://104.237.6.152" -ForegroundColor Gray

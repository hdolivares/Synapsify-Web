# Test Local Build Script
# This script builds and tests the Next.js app locally to catch errors before deployment

Write-Host "=== Testing Local Build ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "1. Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✓ Cleaned .next directory" -ForegroundColor Green
}

# Step 2: Build the project
Write-Host ""
Write-Host "2. Building project..." -ForegroundColor Yellow
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Build failed!" -ForegroundColor Red
    Write-Host $buildResult
    exit 1
}
Write-Host "   ✓ Build successful" -ForegroundColor Green

# Step 3: Check for build warnings/errors
Write-Host ""
Write-Host "3. Checking for build warnings..." -ForegroundColor Yellow
$warnings = $buildResult | Select-String -Pattern "warning|error|Warning|Error" -CaseSensitive
if ($warnings) {
    Write-Host "   ⚠ Found warnings:" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "     $_" -ForegroundColor Yellow }
} else {
    Write-Host "   ✓ No warnings found" -ForegroundColor Green
}

# Step 4: Start production server
Write-Host ""
Write-Host "4. Starting production server on port 3001..." -ForegroundColor Yellow
Write-Host "   Note: Server will run in background. Open http://localhost:3001 in browser to test." -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server when done testing." -ForegroundColor Cyan
Write-Host ""

# Start server in background
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm start
}

# Wait a bit for server to start
Start-Sleep -Seconds 5

# Check if server is running
$portCheck = netstat -ano | Select-String ":3001" | Select-String "LISTENING"
if ($portCheck) {
    Write-Host "   ✓ Server is running on port 3001" -ForegroundColor Green
} else {
    Write-Host "   ✗ Server failed to start" -ForegroundColor Red
    Stop-Job $serverJob
    Remove-Job $serverJob
    exit 1
}

Write-Host ""
Write-Host "=== Testing Instructions ===" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3001 in your browser" -ForegroundColor White
Write-Host "2. Open browser DevTools (F12)" -ForegroundColor White
Write-Host "3. Check Console tab for React errors (especially #482)" -ForegroundColor White
Write-Host "4. Check for 'Application error' messages" -ForegroundColor White
Write-Host "5. Verify page renders correctly" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to stop the server and exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host ""
Write-Host "Stopping server..." -ForegroundColor Yellow
Stop-Job $serverJob
Remove-Job $serverJob
Write-Host "✓ Server stopped" -ForegroundColor Green


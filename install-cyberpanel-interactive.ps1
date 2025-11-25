# CyberPanel Interactive Installation Script
# This script uses Bitvise's interactive terminal (stermc) for installation
# Run this script and follow the prompts in the terminal window

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CyberPanel Installation Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$profile = ".\synapsify.tlp"
$bitviseTerm = "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe"

Write-Host "This will open an interactive terminal session." -ForegroundColor Yellow
Write-Host "You'll need to manually enter the installation options:" -ForegroundColor Yellow
Write-Host ""
Write-Host "When prompted, enter:" -ForegroundColor Green
Write-Host "  1. Option 1 (Install CyberPanel with OpenLiteSpeed)" -ForegroundColor White
Write-Host "  2. Option 1 (Full installation)" -ForegroundColor White
Write-Host "  3. Password: CyberPanel@2025" -ForegroundColor White
Write-Host "  4. Email: hobeja7@gmail.com" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to start the interactive terminal..." -ForegroundColor Cyan
Read-Host

# Start interactive terminal with installation command
Write-Host "Opening interactive terminal..." -ForegroundColor Green
Write-Host "The installation will run in the terminal window." -ForegroundColor Yellow
Write-Host ""

# Create installation script on server first
$installScript = @"
#!/bin/bash
cd /tmp
curl -o cyberpanel-install.sh https://cyberpanel.net/install.sh
chmod +x cyberpanel-install.sh
bash cyberpanel-install.sh
"@

# Upload the script
Write-Host "Preparing installation script on server..." -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=$profile -cmd="cat > /tmp/start-cyberpanel-install.sh << 'EOFMARKER'
$installScript
EOFMARKER
chmod +x /tmp/start-cyberpanel-install.sh"

Write-Host ""
Write-Host "Starting interactive terminal..." -ForegroundColor Green
Write-Host "Follow the prompts in the terminal window." -ForegroundColor Yellow
Write-Host ""

# Start interactive terminal
& $bitviseTerm -profile=$profile -cmd="bash /tmp/start-cyberpanel-install.sh"

Write-Host ""
Write-Host "Installation terminal closed." -ForegroundColor Yellow
Write-Host "Check installation status with:" -ForegroundColor Cyan
Write-Host "  .\check-cyberpanel-status.ps1" -ForegroundColor White


# CyberPanel Installation via Screen Session
# This script starts the installation in a screen session that persists even if connection drops

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CyberPanel Installation (Screen Session)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

# Step 1: Create an improved expect script
Write-Host "Step 1: Creating installation script..." -ForegroundColor Yellow

$expectScript = @'
#!/usr/bin/expect -f
set timeout 1800
log_file /tmp/cyberpanel-install.log

spawn bash /tmp/cyberpanel-install.sh

expect {
    timeout {
        puts "Timeout waiting for prompt"
        exit 1
    }
    "*Please specify the option*" {
        send "1\r"
        exp_continue
    }
    "*Please specify the option (1-3)*" {
        send "1\r"
        exp_continue
    }
    "*Please Enter Your Desired Admin Password*" {
        send "CyberPanel@2025\r"
        exp_continue
    }
    "*Re-enter Your Password*" {
        send "CyberPanel@2025\r"
        exp_continue
    }
    "*Please Enter Your Email*" {
        send "hobeja7@gmail.com\r"
        exp_continue
    }
    "*Press Enter to continue*" {
        send "\r"
        exp_continue
    }
    "*Do you want to restart*" {
        send "n\r"
        exp_continue
    }
    eof {
        puts "Installation completed"
    }
}

interact
'@

# Upload expect script
Write-Host "Uploading installation automation script..." -ForegroundColor Yellow
$expectScript | Out-File -FilePath "cyberpanel-auto-v2.exp" -Encoding ASCII -NoNewline
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=$profile -cmd="put -o cyberpanel-auto-v2.exp /tmp/cyberpanel-auto-v2.exp"

# Fix line endings and make executable
& $bitviseExec -profile=$profile -cmd="sed -i 's/\r$//' /tmp/cyberpanel-auto-v2.exp && chmod +x /tmp/cyberpanel-auto-v2.exp"

# Step 2: Download CyberPanel installer
Write-Host "Step 2: Downloading CyberPanel installer..." -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="curl -o /tmp/cyberpanel-install.sh https://cyberpanel.net/install.sh && chmod +x /tmp/cyberpanel-install.sh"

# Step 3: Start installation in screen session
Write-Host "Step 3: Starting installation in screen session..." -ForegroundColor Yellow
Write-Host "This will take 15-30 minutes. The session will persist even if connection drops." -ForegroundColor Cyan
Write-Host ""

& $bitviseExec -profile=$profile -cmd="screen -dmS cyberpanel-install bash -c '/tmp/cyberpanel-auto-v2.exp; exec bash'"

Start-Sleep -Seconds 3

# Step 4: Verify it started
Write-Host "Step 4: Verifying installation started..." -ForegroundColor Yellow
$screenCheck = & $bitviseExec -profile=$profile -cmd="screen -list"
Write-Host $screenCheck

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To monitor progress:" -ForegroundColor Cyan
Write-Host "  .\monitor-cyberpanel-install.ps1" -ForegroundColor White
Write-Host ""
Write-Host "To attach to the screen session:" -ForegroundColor Cyan
Write-Host "  & `"C:\Program Files (x86)\Bitvise SSH Client\stermc.exe`" -profile=`".\synapsify.tlp`" -cmd=`"screen -r cyberpanel-install`"" -ForegroundColor White
Write-Host ""


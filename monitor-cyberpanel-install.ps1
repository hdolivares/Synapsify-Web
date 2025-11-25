# Monitor CyberPanel Installation Progress

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "Checking CyberPanel Installation Status..." -ForegroundColor Cyan
Write-Host ""

# Check if screen session exists
Write-Host "Screen Session Status:" -ForegroundColor Yellow
$screenStatus = & $bitviseExec -profile=$profile -cmd="screen -list 2>&1"
Write-Host $screenStatus
Write-Host ""

# Check if installation processes are running
Write-Host "Installation Processes:" -ForegroundColor Yellow
$processes = & $bitviseExec -profile=$profile -cmd="ps aux | grep -E 'cyberpanel|install.sh|expect' | grep -v grep"
if ($processes) {
    Write-Host $processes -ForegroundColor Green
} else {
    Write-Host "No installation processes found" -ForegroundColor Red
}
Write-Host ""

# Check if CyberPanel is installed
Write-Host "CyberPanel Installation Check:" -ForegroundColor Yellow
$cyberpanelCheck = & $bitviseExec -profile=$profile -cmd="ls -la /usr/local/CyberCP/ 2>/dev/null | head -5 || echo 'Not installed yet'"
Write-Host $cyberpanelCheck
Write-Host ""

# Check ports
Write-Host "Port Status:" -ForegroundColor Yellow
$ports = & $bitviseExec -profile=$profile -cmd="netstat -tlnp 2>/dev/null | grep -E ':8090|:7080|:80|:443' || echo 'No web ports active'"
Write-Host $ports
Write-Host ""

# Check installation log if exists
Write-Host "Recent Installation Log (if available):" -ForegroundColor Yellow
$log = & $bitviseExec -profile=$profile -cmd="tail -20 /tmp/cyberpanel-install.log 2>/dev/null || echo 'No log file found yet'"
Write-Host $log
Write-Host ""

# Get screen output
Write-Host "Screen Session Output (last 20 lines):" -ForegroundColor Yellow
& $bitviseExec -profile=$profile -cmd="timeout 3 screen -S cyberpanel-install -X hardcopy /tmp/screen-output.txt 2>/dev/null; tail -20 /tmp/screen-output.txt 2>/dev/null || echo 'No screen output available'"
Write-Host ""

Write-Host "To attach to the installation session:" -ForegroundColor Cyan
Write-Host "  & `"C:\Program Files (x86)\Bitvise SSH Client\stermc.exe`" -profile=`".\synapsify.tlp`" -cmd=`"screen -r cyberpanel-install`"" -ForegroundColor White


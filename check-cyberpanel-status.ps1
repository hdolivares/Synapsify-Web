# Quick CyberPanel Status Check

$profile = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "CyberPanel Status Check" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Check if installed
$installed = & $bitviseExec -profile=$profile -cmd="test -d /usr/local/CyberCP && echo 'YES' || echo 'NO'"
Write-Host "Installed: " -NoNewline
if ($installed -eq "YES") {
    Write-Host "YES" -ForegroundColor Green
} else {
    Write-Host "NO" -ForegroundColor Red
}

# Check if ports are listening
Write-Host "Port 8090 (CyberPanel): " -NoNewline
$port8090 = & $bitviseExec -profile=$profile -cmd="netstat -tlnp 2>/dev/null | grep ':8090' || echo 'NOT LISTENING'"
if ($port8090 -match "8090") {
    Write-Host "LISTENING" -ForegroundColor Green
} else {
    Write-Host "NOT LISTENING" -ForegroundColor Red
}

Write-Host "Port 7080 (OpenLiteSpeed): " -NoNewline
$port7080 = & $bitviseExec -profile=$profile -cmd="netstat -tlnp 2>/dev/null | grep ':7080' || echo 'NOT LISTENING'"
if ($port7080 -match "7080") {
    Write-Host "LISTENING" -ForegroundColor Green
} else {
    Write-Host "NOT LISTENING" -ForegroundColor Red
}

# Check OpenLiteSpeed service
Write-Host "OpenLiteSpeed Service: " -NoNewline
$lswsStatus = & $bitviseExec -profile=$profile -cmd="systemctl is-active lsws 2>/dev/null || echo 'inactive'"
if ($lswsStatus -eq "active") {
    Write-Host "ACTIVE" -ForegroundColor Green
} else {
    Write-Host "INACTIVE" -ForegroundColor Red
}

Write-Host ""
if ($installed -eq "YES" -and $port8090 -match "8090") {
    Write-Host "CyberPanel is ready!" -ForegroundColor Green
    Write-Host "Access at: https://104.237.6.152:8090" -ForegroundColor Cyan
    Write-Host "Username: admin" -ForegroundColor White
    Write-Host "Password: CyberPanel@2025" -ForegroundColor White
} else {
    Write-Host "CyberPanel is not ready yet." -ForegroundColor Yellow
    Write-Host "Run .\monitor-cyberpanel-install.ps1 to check installation progress." -ForegroundColor Cyan
}


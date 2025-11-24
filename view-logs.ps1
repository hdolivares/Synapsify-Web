# View Server Logs
# Quick script to view application logs from PM2

param(
    [int]$Lines = 50,
    [switch]$Follow,
    [switch]$ErrorOnly
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Application Logs                  " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$cmd = "pm2 logs synapsify-web"

if ($ErrorOnly) {
    $cmd += " --err"
}

if ($Follow) {
    $cmd += " --lines $Lines"
    Write-Host "Following logs (Ctrl+C to exit)..." -ForegroundColor Yellow
} else {
    $cmd += " --lines $Lines --nostream"
}

& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=$cmd"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan

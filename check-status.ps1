# Check Server Status
# Quick script to check the status of the deployed application

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Server Status Check               " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check PM2 Status
Write-Host "[PM2 Status]" -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=pm2 status"

Write-Host ""

# Check if app is responding
Write-Host "[Application Health]" -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"

Write-Host ""

# Check nginx status
Write-Host "[Nginx Status]" -ForegroundColor Yellow
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    "-profile=C:\Synapsify-Web\synapsify.tlp" `
    "-cmd=systemctl status nginx --no-pager"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan

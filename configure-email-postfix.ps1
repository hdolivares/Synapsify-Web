# Configure Postfix for Email Sending
# This script configures Postfix to use mail.mapio.ai as the hostname

$profilePath = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"

Write-Host "`n📧 Configuring Postfix for Email Sending" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Step 1: Check current configuration
Write-Host "`n[1/4] Checking current Postfix configuration..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profilePath" -cmd="sudo postconf | grep -E 'myhostname|mydomain|myorigin'"

# Step 2: Configure Postfix hostname
Write-Host "`n[2/4] Setting Postfix hostname to mail.mapio.ai..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profilePath" -cmd="sudo postconf -e 'myhostname = mail.mapio.ai'"
& $bitviseExec "-profile=$profilePath" -cmd="sudo postconf -e 'mydomain = mapio.ai'"
& $bitviseExec "-profile=$profilePath" -cmd="sudo postconf -e 'myorigin = mapio.ai'"

# Step 3: Verify configuration
Write-Host "`n[3/4] Verifying configuration..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profilePath" -cmd="sudo postconf | grep -E 'myhostname|mydomain|myorigin'"

# Step 4: Restart Postfix
Write-Host "`n[4/4] Restarting Postfix..." -ForegroundColor Yellow
& $bitviseExec "-profile=$profilePath" -cmd="sudo systemctl restart postfix"
& $bitviseExec "-profile=$profilePath" -cmd="sudo systemctl status postfix --no-pager | head -5"

Write-Host "`n✅ Postfix configuration complete!" -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANT: You still need to:" -ForegroundColor Yellow
Write-Host "   1. Set rDNS/PTR record with your VPS provider (mail.mapio.ai)" -ForegroundColor White
Write-Host "   2. Ensure mail.mapio.ai A record points to 104.237.6.152 (DNS-only, not proxied)" -ForegroundColor White
Write-Host "   3. Configure SPF, DKIM, and DMARC records in DNS" -ForegroundColor White


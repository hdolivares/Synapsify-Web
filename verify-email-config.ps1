# Verify Email Configuration
# Checks DNS records, rDNS, and email server configuration

$profilePath = ".\synapsify.tlp"
$bitviseExec = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$serverIP = "104.237.6.152"

Write-Host "`n🔍 Verifying Email Configuration" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

# Check 1: Forward DNS (mail.mapio.ai)
Write-Host ('`n[1/6] Checking Forward DNS (mail.mapio.ai)...') -ForegroundColor Yellow
$forwardDNS = & $bitviseExec "-profile=$profilePath" -cmd="dig +short mail.mapio.ai"
if ($forwardDNS -match $serverIP) {
    Write-Host "  ✅ mail.mapio.ai resolves to $serverIP" -ForegroundColor Green
} else {
    Write-Host "  ❌ mail.mapio.ai resolves to: $forwardDNS" -ForegroundColor Red
    Write-Host "     Expected: $serverIP" -ForegroundColor Yellow
}

# Check 2: Reverse DNS (rDNS/PTR)
Write-Host ('`n[2/6] Checking Reverse DNS (rDNS/PTR)...') -ForegroundColor Yellow
$reverseDNS = & $bitviseExec "-profile=$profilePath" -cmd="dig +short -x $serverIP"
if ($reverseDNS -match "mail.mapio.ai") {
    Write-Host "  ✅ rDNS for $serverIP is: $reverseDNS" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  rDNS for $serverIP is: $reverseDNS" -ForegroundColor Yellow
    Write-Host "     Expected: mail.mapio.ai" -ForegroundColor Yellow
    Write-Host "     Action: Request rDNS from your VPS provider" -ForegroundColor Yellow
}

# Check 3: MX Record
Write-Host ('`n[3/6] Checking MX Record...') -ForegroundColor Yellow
$mxRecord = & $bitviseExec "-profile=$profilePath" -cmd="dig +short MX mapio.ai"
if ($mxRecord -match "mail.mapio.ai") {
    Write-Host "  ✅ MX record: $mxRecord" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  MX record: $mxRecord" -ForegroundColor Yellow
}

# Check 4: SPF Record
Write-Host ('`n[4/6] Checking SPF Record...') -ForegroundColor Yellow
$spfRecord = & $bitviseExec "-profile=$profilePath" -cmd="dig +short TXT mapio.ai | grep -i spf"
if ($spfRecord) {
    Write-Host "  ✅ SPF record found: $spfRecord" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  SPF record not found" -ForegroundColor Yellow
    Write-Host "     Recommended: v=spf1 ip4:$serverIP a:mail.mapio.ai ~all" -ForegroundColor Yellow
}

# Check 5: DKIM Record
Write-Host ('`n[5/6] Checking DKIM Record...') -ForegroundColor Yellow
$dkimRecord = & $bitviseExec "-profile=$profilePath" -cmd="dig +short TXT default._domainkey.mapio.ai"
if ($dkimRecord) {
    Write-Host "  ✅ DKIM record found" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  DKIM record not found" -ForegroundColor Yellow
    Write-Host "     Action: Generate DKIM key in CyberPanel" -ForegroundColor Yellow
}

# Check 6: Postfix Configuration
Write-Host ('`n[6/6] Checking Postfix Configuration...') -ForegroundColor Yellow
$postfixHostname = & $bitviseExec "-profile=$profilePath" -cmd="sudo postconf myhostname"
if ($postfixHostname -match "mail.mapio.ai") {
    Write-Host "  ✅ Postfix hostname: $postfixHostname" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Postfix hostname: $postfixHostname" -ForegroundColor Yellow
    Write-Host "     Expected: myhostname = mail.mapio.ai" -ForegroundColor Yellow
    Write-Host "     Action: Run configure-email-postfix.ps1" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -NoNewline
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "📋 Summary" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

$checks = @(
    @{Name="Forward DNS"; Status=($forwardDNS -match $serverIP)},
    @{Name="Reverse DNS"; Status=($reverseDNS -match "mail.mapio.ai")},
    @{Name="MX Record"; Status=($mxRecord -match "mail.mapio.ai")},
    @{Name="SPF Record"; Status=($spfRecord -ne $null)},
    @{Name="DKIM Record"; Status=($dkimRecord -ne $null)},
    @{Name="Postfix Config"; Status=($postfixHostname -match "mail.mapio.ai")}
)

foreach ($check in $checks) {
    $icon = if ($check.Status) { "✅" } else { "❌" }
    Write-Host "  $icon $($check.Name)" -ForegroundColor $(if ($check.Status) { "Green" } else { "Red" })
}

Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Fix any issues shown above" -ForegroundColor White
Write-Host "   2. Test email sending: https://www.mail-tester.com/" -ForegroundColor White
Write-Host "   3. Check email reputation: https://mxtoolbox.com/blacklists.aspx" -ForegroundColor White


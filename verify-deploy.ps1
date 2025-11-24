$sexecPath = "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
$profile = ".\synapsify.tlp"

Write-Host "🔍 Checking if files were updated on server..." -ForegroundColor Cyan

# Check last modified time of BugInvaders.tsx
Write-Host "`n📄 Checking BugInvaders.tsx..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="ls -lh /root/Synapsify-Web/components/BugInvaders.tsx"

# Check last modified time of Navbar.tsx
Write-Host "`n📄 Checking Navbar.tsx..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="ls -lh /root/Synapsify-Web/components/Navbar.tsx"

# Check if auth callback exists
Write-Host "`n📄 Checking auth callback route..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="ls -lh /root/Synapsify-Web/app/auth/callback/route.ts"

# Check the git log
Write-Host "`n📋 Recent git commits..." -ForegroundColor Yellow
& $sexecPath -profile=$profile -cmd="cd /root/Synapsify-Web && git log --oneline -3"

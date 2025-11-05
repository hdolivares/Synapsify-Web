# Upload Single File Script
# Usage: .\upload-file.ps1 -FilePath "components\Hero.tsx"
# Or: .\upload-file.ps1 -FilePath "components\Hero.tsx" -RemotePath "/root/Synapsify-Web/components/Hero.tsx"

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$false)]
    [string]$RemotePath
)

$profile = ".\synapsify.tlp"
$bitvisePath = "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe"

# If RemotePath not provided, infer it from FilePath
if (-not $RemotePath) {
    $RemotePath = "/root/Synapsify-Web/$FilePath"
}

# Convert Windows path to Unix-style for remote
$RemotePath = $RemotePath -replace '\\', '/'

Write-Host "📤 Uploading file..." -ForegroundColor Cyan
Write-Host "Local:  $FilePath" -ForegroundColor Yellow
Write-Host "Remote: $RemotePath" -ForegroundColor Yellow
Write-Host ""

& $bitvisePath -profile=$profile -cmd="put -o $FilePath $RemotePath"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ File uploaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Rebuild and restart" -ForegroundColor Cyan
    Write-Host "Run: .\rebuild-restart.ps1" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Upload failed!" -ForegroundColor Red
}


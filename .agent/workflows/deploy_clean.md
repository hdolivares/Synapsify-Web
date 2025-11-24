---
description: Perform a clean deployment to the VPS (Reset, Clean, Rebuild, Restart)
---

This workflow performs a complete clean deployment to the server to ensure all changes are reflected and no stale caches exist.
It uses a Windows Batch script to avoid PowerShell quoting issues with Bitvise `sexec`.

1. Create the deployment batch script
```bat
@echo off
set SEXEC="C:\Program Files (x86)\Bitvise SSH Client\sexec.exe"
set PROFILE="c:\Synapsify-Web\synapsify.tlp"

echo 🚀 Testing Connection...
%SEXEC% -profile=%PROFILE% -cmd="ls -la /root/Synapsify-Web"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Configuring Git...
%SEXEC% -profile=%PROFILE% -cmd="git config --global --add safe.directory /root/Synapsify-Web"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Fetching Changes...
%SEXEC% -profile=%PROFILE% -cmd="cd /root/Synapsify-Web && git fetch --all"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Resetting to Main...
%SEXEC% -profile=%PROFILE% -cmd="cd /root/Synapsify-Web && git reset --hard origin/main"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Removing Caches...
%SEXEC% -profile=%PROFILE% -cmd="cd /root/Synapsify-Web && rm -rf node_modules .next"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Installing Dependencies...
%SEXEC% -profile=%PROFILE% -cmd="cd /root/Synapsify-Web && npm install"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Building Project...
%SEXEC% -profile=%PROFILE% -cmd="cd /root/Synapsify-Web && npm run build"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Restarting PM2...
%SEXEC% -profile=%PROFILE% -cmd="pm2 restart synapsify-web"
echo Exit Code: %ERRORLEVEL%

echo 🚀 Restarting Nginx...
%SEXEC% -profile=%PROFILE% -cmd="systemctl restart nginx"
echo Exit Code: %ERRORLEVEL%

echo ✅ All steps completed (check exit codes above)!
exit /b 0
```
// turbo
2. Run the deployment script
```bash
cmd /c deploy_clean.bat
```

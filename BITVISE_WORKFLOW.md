# Bitvise SSH Workflow for Synapsify-Web

This document provides Bitvise SSH Client workflows specifically for deploying and managing the Synapsify-Web Next.js application.

## Current Production Configuration (synapsify.app)

**Last Updated:** November 25, 2025

### Architecture
- **Web Server:** OpenLiteSpeed (via CyberPanel)
- **Application Server:** Next.js running on port 3001 via PM2
- **Proxy Configuration:** OpenLiteSpeed extprocessor proxy
- **Domain:** synapsify.app (with SSL via Let's Encrypt)

### Key Configuration Details

**OpenLiteSpeed Virtual Host (`/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf`):**
```
extprocessor nextjs {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                300
  initTimeout             60
  retryTimeout            60
  respBuffer              1
}

context / {
  type                    proxy
  handler                 nextjs
  addDefaultCharset       off
}
```

**PM2 Configuration:**
- **Name:** synapsify-web
- **Port:** 3001 (to avoid conflict with nghttpx on port 3000)
- **Location:** `/home/synapsify.app/synapsify-web`
- **Start Command:** `npm start` (which runs `next start -p 3001`)

**Important Notes:**
- ⚠️ **Wait 10-15 seconds after restarting OpenLiteSpeed** for proxy configuration to fully load
- The proxy context must come BEFORE `scripthandler` in the vhost.conf
- synapsify.app must be mapped in OpenLiteSpeed's listener configuration
- SSL certificates are managed via CyberPanel/Let's Encrypt

**Deployment Path:**
- Project directory: `/home/synapsify.app/synapsify-web`
- Build output: `/home/synapsify.app/synapsify-web/.next`
- PM2 logs: `/home/synapsify.app/synapsify-web/logs/`

**Testing:**
```powershell
# Test with correct Host header (required for virtual host matching)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="curl -H 'Host: synapsify.app' http://127.0.0.1"
```

## ⚠️ CRITICAL: Testing Before Deployment

**ALWAYS test locally before deploying to VPS!** This prevents errors from reaching production.

### Step 1: Build and Test Locally (REQUIRED)

```powershell
# 1. Build the project
npm run build

# 2. Start production server (matches VPS environment)
npm start
# Server runs on port 3001

# 3. Test in browser
# Open http://localhost:3001 in your browser
# Open DevTools (F12) → Console tab
# Check for ANY errors (especially React errors)
```

**What to Check:**
- ✅ Build succeeds without errors
- ✅ Page loads correctly
- ✅ **NO console errors** (check DevTools Console tab)
- ✅ No React Error #482 (hydration mismatch)
- ✅ No "Application error" messages
- ✅ All components render correctly

### Step 2: Test Dev Build for Detailed Errors

```powershell
# Start dev server (shows full error messages)
npm run dev
# Server runs on port 3020

# Open http://localhost:3020 in browser
# Check console for detailed error messages
```

**Why Test Dev Build:**
- Shows **full error messages** (not minified)
- Easier to debug issues
- Catches TypeScript errors
- Shows React hydration warnings in detail

### Step 3: Use Browser DevTools

**Essential Checks:**
1. **Console Tab:**
   - Look for red errors
   - Check for React Error #482
   - Check for async/await errors
   - Check for hydration mismatches

2. **React DevTools (if installed):**
   - Components tab (not Profiler)
   - Look for yellow warning badges
   - Check for "Hydration failed" messages

3. **Network Tab:**
   - Verify all assets load (200 status)
   - Check for 404 errors (especially favicon.ico)

### Common Errors to Catch Before Deployment

**1. React Error #482 (Hydration Mismatch)**
- **Cause:** Server/client HTML differs
- **Fix:** Ensure components render consistently
- **Test:** Check console in production build

**2. Async Client Component Error**
- **Cause:** Client component returns Promise
- **Fix:** Use synchronous code or .then() chains
- **Test:** Check dev build console

**3. TypeScript Errors**
- **Cause:** Type mismatches (especially with React 19)
- **Fix:** Update types, add initial values to useRef
- **Test:** Build will fail if errors exist

**4. Missing Dependencies**
- **Cause:** New packages not installed
- **Fix:** Run `npm install` before building
- **Test:** Build will fail if missing

### Testing Checklist

Before deploying, verify:
- [ ] `npm run build` succeeds
- [ ] `npm start` runs without errors
- [ ] Page loads at http://localhost:3001
- [ ] **Browser console is empty** (no errors)
- [ ] No React hydration errors
- [ ] All interactive elements work
- [ ] Animations work smoothly
- [ ] Tested in regular browser (Chrome/Firefox)
- [ ] Tested in incognito mode (rule out extensions)

### Why This Matters

**Lessons Learned:**
- ❌ **Don't skip local testing** - Errors will appear on VPS
- ❌ **Don't rely on build success alone** - Runtime errors exist
- ✅ **Always check browser console** - Errors hide there
- ✅ **Test production build** - Matches VPS environment
- ✅ **Test dev build** - Shows detailed errors

**The Rule:** If it doesn't work locally, it won't work on the VPS!

## 📚 Deployment Lessons Learned

**Last Updated:** November 25, 2025

### Next.js 16 + Turbopack Build Issues

**Issue**: `npm run build` may fail with exit code 1 even when compilation succeeds.

**Symptoms:**
```
✓ Compiled successfully in 6.0s
Running TypeScript ...
Finalizing page optimization ...
Exit code: 1
```

**Root Cause**: Known issue with Next.js 16.0.4 + Turbopack - build appears successful but returns error code.

**Solutions:**

1. **Option 1: PM2 Restart (Recommended)**
   ```powershell
   # If build shows "Compiled successfully", just restart PM2
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" "-cmd=cd /home/synapsify.app/synaps ify-web && git pull && pm2 restart synapsify-web"
   ```

2. **Option 2: Clear Cache and Rebuild**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" "-cmd=cd /home/synapsify.app/synapsify-web && rm -rf .next && npm run build"
   ```

3. **Option 3: Deploy Without Build** (if local build works)
   ```powershell   # Pull changes and restart - uses existing .next from previous successful build
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" "-cmd=cd /home/synapsify.app/synapsify-web && git pull && pm2 restart synapsify-web"
   ```

**Verification Commands:**
```powershell
# Check if app is running
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" "-cmd=pm2 logs synapsify-web --lines 30 --nostream"

# Test site response
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" "-cmd=curl -H 'Host: synapsify.app' http://127.0.0.1 -I"
```

**Key Takeaway:** PM2 restart alone often works fine when code changes don't require a fresh build. The app can run with the existing .next directory.

## ⭐ Recommended Workflow (New!)

**🎯 Use the automated git-based deployment script for best results!**

See [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md) for complete details.

### Quick Deploy from Local Changes

```powershell
# Simple one-command deployment
.\deploy-from-local.ps1
```

This script automatically:
1. ✓ Checks for uncommitted changes
2. ✓ Commits and pushes to GitHub
3. ✓ Pulls changes on server via Bitvise
4. ✓ Installs dependencies and builds
5. ✓ Restarts PM2 service

**Benefits:**
- Full version control tracking
- Easy rollbacks via git
- Enforces best practices
- Complete audit trail

### Utility Scripts

```powershell
# Check server status
.\check-status.ps1

# View application logs
.\view-logs.ps1              # Last 50 lines
.\view-logs.ps1 -Follow      # Real-time
.\view-logs.ps1 -ErrorOnly   # Errors only
```

---

## Manual Bitvise Commands (Advanced)

For advanced users who need direct control via Bitvise commands:

## Prerequisites

- Bitvise SSH Client installed
- `synapsify.tlp` profile file in project root
- Server access: `104.237.6.152` (root user)
- GitHub PAT configured on server (already set up)

## Available Bitvise Tools

**⚠️ Important Tool Usage:**

- **Use `sexec`** for: Running commands, checking logs, restarting services, PM2 management
- **Use `sftpc`** for: Uploading files, downloading files, file synchronization
- **Use `stermc`** for: Interactive terminal sessions

**Common Mistake**: Trying to use `sexec` for file uploads will NOT work. Always use `sftpc` for file operations.

## Initial Server Setup

### 1. First-Time Deployment

```powershell
# Navigate to project root
cd C:\Synapsify-Web

# Step 1: Configure Git on server
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="git config --global user.name 'hdolivares'"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="git config --global user.email 'hobeja7@gmail.com'"

# Step 2: Install Node.js (if not installed)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs"

# Step 3: Install PM2 globally
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="npm install -g pm2"

# Step 4: Install nginx (if not installed)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get update && apt-get install -y nginx"

# Step 5: Clone repository (using PAT)
# Replace YOUR_GITHUB_PAT with your actual Personal Access Token
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root && git clone https://YOUR_GITHUB_PAT@github.com/hdolivares/Synapsify-Web.git"

# Step 6: Upload setup script and run it
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o server-setup.sh /root/Synapsify-Web/server-setup.sh"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && chmod +x server-setup.sh && ./server-setup.sh"
```

### 2. Manual Setup (Alternative)

```powershell
# Navigate to project
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web"

# Install dependencies
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm install"

# Build the project
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm run build"

# Start with PM2
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && pm2 start npm --name 'synapsify-web' -- start"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 save"
```

## Deployment Workflows

### ⭐ Recommended: Automated Script

**Use this for 99% of deployments:**

```powershell
# One command to rule them all!
.\deploy-from-local.ps1
```

See [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md) for details.

---

### Manual Deployment (When You Need Direct Control)

#### Option 1: Git Pull Deployment (Manual)

```powershell
# Navigate to project root
cd C:\Synapsify-Web

# Pull latest changes on server
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && git pull"

# Install any new dependencies
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm install"

# Rebuild the project
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm run build"

# Restart PM2 process
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 restart synapsify-web"
```

#### Option 2: Upload Specific Files

```powershell
# Navigate to project root
cd C:\Synapsify-Web

# Upload specific component file
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o components\Hero.tsx /root/Synapsify-Web/components/Hero.tsx"

# Upload multiple component files
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="cd components; put -o Hero.tsx Problem.tsx Solution.tsx /root/Synapsify-Web/components/"

# Upload all TypeScript files from components directory
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="cd components; put -o *.tsx /root/Synapsify-Web/components/"

# After uploading files, rebuild and restart
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm run build && pm2 restart synapsify-web"
```

#### Option 3: Upload Entire Project (Full Deployment)

```powershell
# Navigate to project root
cd C:\Synapsify-Web

# Upload entire project directory (excluding node_modules and .next)
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -r -o . /root/Synapsify-Web/"

# Then on server: install dependencies, build, and restart
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm install && npm run build && pm2 restart synapsify-web"
```

## Service Management

### PM2 Commands

```powershell
# Check PM2 status
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"

# View logs (real-time)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 100"

# View logs (last 50 lines)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 50 --nostream"

# Restart application
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 restart synapsify-web"

# Stop application
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 stop synapsify-web"

# Start application
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 start synapsify-web"

# Delete application from PM2
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 delete synapsify-web"

# Reload application (zero-downtime restart)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 reload synapsify-web"

# Monitor PM2 (shows CPU, memory usage)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 monit"
```

### Nginx Management

```powershell
# Check nginx status
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl status nginx"

# Test nginx configuration
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nginx -t"

# Reload nginx (apply config changes)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl reload nginx"

# Restart nginx
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart nginx"

# View nginx error logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -f /var/log/nginx/error.log"

# View nginx access logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -f /var/log/nginx/access.log"
```

### Upload Nginx Configuration

```powershell
# Upload nginx config file
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o nginx-config.conf /etc/nginx/sites-available/synapsify-web"

# Test and reload nginx
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nginx -t && systemctl reload nginx"
```

## Monitoring & Debugging

### Check Application Status

```powershell
# Check if app is running on port 3000
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 3000"

# Check PM2 process info
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 info synapsify-web"

# Check system resources
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="free -h && df -h"
```

### View Logs

```powershell
# PM2 logs (real-time, last 100 lines)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 100"

# PM2 logs (error only)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --err --lines 50"

# Check build output
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && tail -n 50 .next/build.log"
```

### Debugging Issues

```powershell
# Check if port 3000 is in use
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="lsof -i :3000"

# Check Node.js version
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="node --version && npm --version"

# Check if .next build directory exists
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /root/Synapsify-Web/.next"

# Test localhost connection
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl http://localhost:3000"
```

## Common Workflows

### Quick Deploy After Local Changes

```powershell
# 1. Commit and push changes locally
cd C:\Synapsify-Web
git add .
git commit -m "Update feature X"
git push origin main

# 2. Pull and deploy on server
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && git pull && npm install && npm run build && pm2 restart synapsify-web"
```

### Upload Single File and Rebuild

```powershell
# 1. Upload file
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o components\Hero.tsx /root/Synapsify-Web/components/Hero.tsx"

# 2. Rebuild and restart
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm run build && pm2 restart synapsify-web"
```

### Update Dependencies

```powershell
# 1. Upload package.json and package-lock.json
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o package.json package-lock.json /root/Synapsify-Web/"

# 2. Install dependencies and rebuild
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm install && npm run build && pm2 restart synapsify-web"
```

### Set Up SSL Certificate (Let's Encrypt)

```powershell
# Install certbot
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get install -y certbot python3-certbot-nginx"

# Get SSL certificate (replace with your domain)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="certbot --nginx -d synapsify.com -d www.synapsify.com"

# Auto-renewal test
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="certbot renew --dry-run"
```

## Multi-Service Setup

### Deploy Additional Service on Different Port

```powershell
# 1. Clone another project or deploy to different directory
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root && git clone https://github.com/user/other-project.git"

# 2. Deploy to different port (e.g., 3001)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/other-project && npm install && PORT=3001 npm run build && pm2 start npm --name 'other-project' -- start -- -p 3001"

# 3. Create nginx config for new domain
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o nginx-other-domain.conf /etc/nginx/sites-available/other-domain"
# Edit the config to point to localhost:3001

# 4. Enable and reload nginx
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ln -s /etc/nginx/sites-available/other-domain /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"
```

### List All PM2 Services

```powershell
# Show all PM2 processes
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 list"

# Show PM2 startup script
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 startup"
```

## File Transfer Examples

### Upload Project Files

```powershell
# Upload single file
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o app\page.tsx /root/Synapsify-Web/app/page.tsx"

# Upload all files from a directory
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="cd components; put -o *.tsx /root/Synapsify-Web/components/"

# Upload entire directory recursively
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -r -o components /root/Synapsify-Web/"
```

### Download Files from Server

```powershell
# Download log file
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="get /root/.pm2/logs/synapsify-web-out.log C:\logs\synapsify-out.log"

# Download nginx config
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="get /etc/nginx/sites-available/synapsify-web C:\nginx-config-backup.conf"
```

## Interactive Terminal

```powershell
# Open interactive SSH terminal (useful for complex operations)
& "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe" -profile=".\synapsify.tlp"
```

## Troubleshooting

### Application Won't Start

```powershell
# Check PM2 logs for errors
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --err --lines 100"

# Check if port is already in use
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="lsof -i :3000"

# Try building manually
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && npm run build"
```

### Nginx 502 Bad Gateway

```powershell
# Check if Next.js is running
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"

# Check if port 3000 is accessible
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl http://localhost:3000"

# Check nginx error logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -50 /var/log/nginx/error.log"
```

### Build Failures

```powershell
# Check Node.js version
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="node --version"

# Clear .next directory and rebuild
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && rm -rf .next && npm run build"

# Clear node_modules and reinstall
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && rm -rf node_modules && npm install && npm run build"
```

## Quick Reference

### Most Common Commands

```powershell
# Quick deploy (git pull + rebuild + restart)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web && git pull && npm install && npm run build && pm2 restart synapsify-web"

# Check status
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"

# View logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 50"

# Restart
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 restart synapsify-web"
```


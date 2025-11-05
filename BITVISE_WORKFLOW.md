# Bitvise SSH Workflow for Synapsify-Web

This document provides Bitvise SSH Client workflows specifically for deploying and managing the Synapsify-Web Next.js application.

## Prerequisites

- Bitvise SSH Client installed
- `synapsify.tlp` profile file in project root
- Server access: `104.237.6.152` (root user)

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

### Deploying Code Changes

#### Option 1: Git Pull (Recommended)

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


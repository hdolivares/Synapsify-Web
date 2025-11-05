# Quick Start: Server Setup Guide

## ⚠️ IMPORTANT: Accept Host Key First!

Before running any commands, you **must** accept the server's host key. Do this **once**:

### Option 1: Using Bitvise GUI (Easiest)
1. Open Bitvise SSH Client
2. File → Open Profile → Select `synapsify.tlp`
3. Click "Log in"
4. When prompted: **Click "Accept and Save"**
5. Close Bitvise GUI

### Option 2: Using Interactive Terminal
```powershell
cd C:\Synapsify-Web
& "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe" -profile=".\synapsify.tlp"
# When prompted, type: S
# Then type: exit
```

---

## 🚀 Automated Setup (After Accepting Host Key)

Once the host key is accepted, run this **one command**:

```powershell
cd C:\Synapsify-Web
.\server-setup-bitvise.ps1 -GitHubPAT "YOUR_GITHUB_PAT_HERE"
# Replace YOUR_GITHUB_PAT_HERE with your actual GitHub Personal Access Token
```

This will:
- ✅ Configure Git
- ✅ Install Node.js 20.x
- ✅ Install PM2
- ✅ Install nginx
- ✅ Clone repository
- ✅ Install dependencies
- ✅ Build project
- ✅ Start with PM2
- ✅ Configure nginx

---

## 📋 Manual Setup (If Script Fails)

If you prefer manual setup or the script fails, run these commands one by one:

```powershell
# Navigate to project
cd C:\Synapsify-Web

# 1. Configure Git
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="git config --global user.name 'hdolivares'"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="git config --global user.email 'hobeja7@gmail.com'"

# 2. Install Node.js
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get install -y nodejs"

# 3. Install PM2
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="npm install -g pm2"

# 4. Install nginx
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get update"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get install -y nginx"

# 5. Clone repository (replace YOUR_GITHUB_PAT with your actual token)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root; git clone https://YOUR_GITHUB_PAT@github.com/hdolivares/Synapsify-Web.git"

# 6. Install dependencies
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web; npm install"

# 7. Build project
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web; npm run build"

# 8. Start with PM2
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /root/Synapsify-Web; pm2 start npm --name synapsify-web -- start"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 save"

# 9. Configure nginx
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o nginx-config.conf /etc/nginx/sites-available/synapsify-web"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ln -sf /etc/nginx/sites-available/synapsify-web /etc/nginx/sites-enabled/synapsify-web"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="rm -f /etc/nginx/sites-enabled/default"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nginx -t"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl reload nginx"
```

---

## ✅ Verify Setup

```powershell
# Check PM2 status
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"

# Test localhost connection
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl http://localhost:3000"

# View logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 20"
```

---

## 🔧 After Setup: Configure Domain

1. Edit nginx config on server:
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nano /etc/nginx/sites-available/synapsify-web"
   # Change 'server_name synapsify.com www.synapsify.com;' to your domain
   # Save: Ctrl+X, Y, Enter
   ```

2. Reload nginx:
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nginx -t && systemctl reload nginx"
   ```

3. (Optional) Set up SSL:
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get install -y certbot python3-certbot-nginx"
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="certbot --nginx -d yourdomain.com -d www.yourdomain.com"
   ```


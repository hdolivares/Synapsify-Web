# Deployment Summary: synapsify.app

## ✅ Pre-Deployment Testing Complete

### Local Build Status
- **Build:** ✅ Successful (`npm run build`)
- **TypeScript:** ✅ No errors
- **Linting:** ⚠️ Minor warnings (non-critical, unescaped quotes in JSX)
- **Dependencies:** ✅ All installed

### Build Output
```
Route (app)                              Size     First Load JS
┌ ƒ /                                    16.5 kB         204 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ƒ /api/waitlist                        0 B                0 B
├ ○ /arcade                              635 B           188 kB
└ ƒ /auth/callback                       0 B                0 B
```

## Current Server Status

### Port Configuration
- **Port 3000:** Used by `nghttpx` (CyberPanel HTTP/2 proxy)
- **Port 3001:** Available for Next.js app ✅
- **Port 8090:** CyberPanel control panel ✅

### Current Website
- **Location:** `/home/synapsify.app/public_html/index.html`
- **Content:** CyberPanel default installation message
- **Needs:** Replace with Next.js app proxy

## Deployment Plan

### Option 1: Automated Deployment (Recommended)

Run the deployment script:

```powershell
.\deploy-synapsify-app.ps1
```

**What it does:**
1. Creates `/home/synapsify.app/synapsify-web/` directory
2. Clones repository from GitHub
3. Installs dependencies (`npm install`)
4. Builds application (`npm run build`)
5. Starts with PM2 on port 3001
6. Configures OpenLiteSpeed to proxy to port 3001

### Option 2: Manual Deployment

#### Step 1: Clone Repository

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app && git clone https://github.com/hdolivares/Synapsify-Web.git synapsify-web"
```

**Note:** You'll need GitHub credentials or PAT.

#### Step 2: Install & Build

```powershell
# Install dependencies
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && npm install"

# Build application
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && npm run build"
```

#### Step 3: Start with PM2

```powershell
# Update ecosystem.config.js path
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o ecosystem.config.js /home/synapsify.app/synapsify-web/ecosystem.config.js"

# Start application
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && mkdir -p logs && pm2 start ecosystem.config.js && pm2 save"
```

#### Step 4: Configure OpenLiteSpeed Proxy

Upload and run the configuration script:

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sftpc.exe" -profile=".\synapsify.tlp" -cmd="put -o configure-lsws-nextjs.sh /tmp/configure-lsws-nextjs.sh"
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="chmod +x /tmp/configure-lsws-nextjs.sh && bash /tmp/configure-lsws-nextjs.sh"
```

Or manually edit `/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf`:

Add this before `scripthandler {`:

```apache
context / {
  type                    proxy
  handler                 lsphp
  addDefaultCharset       off
  proxy                   http://127.0.0.1:3001
  addHeader               X-Forwarded-Proto $scheme
  addHeader               X-Forwarded-For $proxy_add_x_forwarded_for
  addHeader               Host $host
}
```

Then restart:
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart lsws"
```

## Configuration Details

### Port Mapping
- **External:** `synapsify.app:80/443` (HTTP/HTTPS)
- **Proxy:** OpenLiteSpeed → `localhost:3001`
- **Application:** Next.js running on port 3001

### Directory Structure
```
/home/synapsify.app/
├── public_html/          (CyberPanel default - can be ignored)
└── synapsify-web/        (Next.js application)
    ├── .next/            (Build output)
    ├── app/              (Next.js app directory)
    ├── components/       (React components)
    ├── public/           (Static assets)
    ├── ecosystem.config.js
    └── package.json
```

### PM2 Configuration
- **Name:** synapsify-web
- **Port:** 3001
- **Mode:** fork
- **Auto-restart:** Yes
- **Logs:** `/home/synapsify.app/synapsify-web/logs/`

## Verification Steps

### 1. Check PM2 Status
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"
```

Should show: `synapsify-web` running

### 2. Check Port 3001
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 3001"
```

Should show: `0.0.0.0:3001` listening

### 3. Test Localhost
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -I http://localhost:3001 | head -3"
```

Should return: `HTTP/1.1 200 OK`

### 4. Test Domain
Visit: `https://synapsify.app`

Should show your Next.js website (not CyberPanel default page)

## Troubleshooting

### Application Not Starting

**Check PM2 logs:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 50"
```

**Common issues:**
- Missing dependencies: Run `npm install` again
- Build errors: Check `npm run build` output
- Port conflict: Check if port 3001 is available

### Still Seeing CyberPanel Default Page

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Check OpenLiteSpeed config:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cat /usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf | grep -A 10 'context /'"
   ```
3. **Restart OpenLiteSpeed:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart lsws"
   ```

### Proxy Not Working

**Check OpenLiteSpeed error logs:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -50 /usr/local/lsws/logs/error.log"
```

**Verify Next.js is running:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl http://localhost:3001"
```

## Environment Variables (If Needed)

If you need Supabase or other environment variables:

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && cat > .env.production << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
EOF"
```

Then restart PM2:
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 restart synapsify-web"
```

## Next Steps

1. ✅ Local build tested and successful
2. ⏳ Deploy to server (run `.\deploy-synapsify-app.ps1`)
3. ⏳ Configure OpenLiteSpeed proxy
4. ⏳ Test website on synapsify.app
5. ⏳ Set up SSL (already configured via CyberPanel)

## Files Created

- `deploy-synapsify-app.ps1` - Automated deployment script
- `configure-lsws-nextjs.sh` - OpenLiteSpeed configuration script
- `DEPLOY_SYNAPSIFY_APP.md` - Detailed deployment guide
- `DEPLOYMENT_SUMMARY.md` - This file

---

**Status:** Ready for deployment  
**Build:** ✅ Successful  
**Next:** Run deployment script


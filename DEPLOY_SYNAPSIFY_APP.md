# Deploy Synapsify-Web to synapsify.app

## Pre-Deployment Checklist

✅ **Local Build Test:**
- Build successful: `npm run build` ✓
- No TypeScript errors ✓
- No critical linting errors ✓

## Deployment Steps

### Step 1: Run Deployment Script

```powershell
.\deploy-synapsify-app.ps1
```

This script will:
1. Stop any existing processes
2. Create project directory
3. Clone repository from GitHub
4. Install dependencies
5. Build Next.js application
6. Start with PM2 on port 3001
7. Configure OpenLiteSpeed to proxy to Next.js

### Step 2: Manual Steps (If Script Fails)

#### Clone Repository

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app && git clone https://github.com/hdolivares/Synapsify-Web.git synapsify-web"
```

**Note:** You may need to provide GitHub credentials or use a PAT.

#### Install Dependencies

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && npm install"
```

#### Build Application

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && npm run build"
```

#### Start with PM2

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && pm2 start ecosystem.config.js && pm2 save"
```

#### Configure OpenLiteSpeed Proxy

The virtual host needs to proxy requests to port 3001. Update `/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf`:

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

Then restart OpenLiteSpeed:
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart lsws"
```

## Port Configuration

**Why Port 3001?**
- Port 3000 is used by `nghttpx` (CyberPanel HTTP/2 proxy service)
- Next.js app will run on port 3001
- OpenLiteSpeed will proxy `synapsify.app` → `localhost:3001`

## Environment Variables

If you need environment variables (e.g., Supabase), create `.env.production`:

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.app/synapsify-web && cat > .env.production << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EOF"
```

## Verification

### Check PM2 Status

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"
```

Should show `synapsify-web` running.

### Check Port 3001

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 3001"
```

Should show: `0.0.0.0:3001` listening

### Test Localhost

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -I http://localhost:3001 | head -3"
```

Should return: `HTTP/1.1 200 OK`

### Test Domain

Visit: `https://synapsify.app`

Should show your Next.js website instead of CyberPanel default page.

## Troubleshooting

### Application Not Starting

```powershell
# Check PM2 logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 50"
```

### Port Already in Use

```powershell
# Check what's using port 3001
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="lsof -i :3001 || netstat -tlnp | grep 3001"
```

### OpenLiteSpeed Not Proxying

```powershell
# Check virtual host config
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cat /usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf | grep -A 10 'context /'"
```

### Still Seeing CyberPanel Default Page

1. Clear browser cache
2. Check OpenLiteSpeed error logs:
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -50 /usr/local/lsws/logs/error.log"
   ```
3. Verify proxy configuration is correct
4. Restart OpenLiteSpeed: `systemctl restart lsws`

## Current Configuration

- **Domain:** synapsify.app
- **Next.js Port:** 3001
- **Project Directory:** `/home/synapsify.app/synapsify-web`
- **PM2 Process:** synapsify-web
- **Proxy:** OpenLiteSpeed → localhost:3001

---

**Status:** Ready for deployment  
**Next Step:** Run `.\deploy-synapsify-app.ps1`


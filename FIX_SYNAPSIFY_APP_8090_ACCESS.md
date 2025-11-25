# Fix: synapsify.app:8090 Not Loading

## Problem Identified

**Root Cause:** Cloudflare Proxy is blocking port 8090

### Current Status

✅ **Server Status:**
- Port 8090 is listening: `0.0.0.0:8090` ✓
- CyberPanel service is running ✓
- Localhost access works: `curl https://localhost:8090` returns HTTP 200 ✓
- Certificate is configured correctly ✓

❌ **DNS Issue:**
- `synapsify.app` resolves to Cloudflare IPs:
  - `172.67.152.43` (Cloudflare)
  - `104.21.88.186` (Cloudflare)
- Should resolve to: `104.237.6.152` (your server)

### Why Port 8090 Doesn't Work

**Cloudflare blocks non-standard ports** (including 8090) when the proxy is enabled (orange cloud). This is a Cloudflare security feature.

## Solutions

### Solution 1: Disable Cloudflare Proxy (Recommended)

**Steps:**

1. **Log into Cloudflare Dashboard:**
   - Go to https://dash.cloudflare.com
   - Select your domain: `synapsify.app`

2. **Go to DNS Settings:**
   - Click **DNS** in the left sidebar
   - Find the A record for `synapsify.app`

3. **Disable Proxy (Gray Cloud):**
   - Click the **orange cloud** icon next to the A record
   - It should turn **gray** (DNS only, no proxy)
   - This allows direct connection to your server

4. **Update A Record:**
   - Ensure the A record points to: `104.237.6.152`
   - TTL: Auto or 300 seconds

5. **Wait for DNS Propagation:**
   - Usually takes 1-5 minutes
   - Verify: `nslookup synapsify.app` should return `104.237.6.152`

6. **Test Access:**
   - `https://synapsify.app:8090` should now work

**Note:** With proxy disabled, you'll lose Cloudflare's DDoS protection and CDN features for port 8090, but this is necessary for CyberPanel access.

### Solution 2: Use IP Address Directly (Temporary)

While fixing DNS, you can access CyberPanel directly:

```
https://104.237.6.152:8090
```

**Note:** You'll see a certificate warning because the certificate is for `synapsify.app`, not the IP. This is safe to accept.

### Solution 3: Cloudflare Tunnel (Advanced)

If you want to keep Cloudflare proxy enabled, you can use Cloudflare Tunnel:

1. Install `cloudflared` on your server
2. Create a tunnel for port 8090
3. Configure Cloudflare to route `synapsify.app:8090` through the tunnel

**This is more complex but allows you to keep Cloudflare protection.**

## Verification Steps

### Step 1: Check DNS Resolution

**From your local machine:**
```powershell
nslookup synapsify.app
```

**Should return:**
```
Name:    synapsify.app
Address: 104.237.6.152
```

**If it returns Cloudflare IPs**, the proxy is still enabled.

### Step 2: Check Server Status

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 8090"
```

**Should show:**
```
tcp  0  0  0.0.0.0:8090  0.0.0.0:*  LISTEN  333507/lscpd
```

### Step 3: Test Localhost Access

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -k https://localhost:8090 | head -5"
```

**Should return:** HTML content (CyberPanel login page)

### Step 4: Test External Access

**After disabling Cloudflare proxy:**
```powershell
curl -k https://synapsify.app:8090
```

**Should return:** CyberPanel login page

## Current Configuration

- **Server IP:** 104.237.6.152
- **Domain:** synapsify.app
- **CyberPanel Port:** 8090
- **SSL Certificate:** synapsify.app (Let's Encrypt, valid until Feb 3, 2026)
- **Service Status:** Running ✓
- **Port Status:** Listening ✓
- **DNS Status:** ❌ Resolving to Cloudflare (proxy enabled)

## Why Port 80 Works But 8090 Doesn't

- **Port 80 (HTTP):** Cloudflare allows standard web ports (80, 443)
- **Port 8090:** Cloudflare blocks non-standard ports when proxy is enabled
- **Solution:** Disable proxy for direct server access on port 8090

## Quick Fix Command

After disabling Cloudflare proxy, verify DNS:

```powershell
# Check DNS resolution
nslookup synapsify.app

# Should show: 104.237.6.152
# If it shows Cloudflare IPs, wait a few minutes for DNS propagation
```

## Troubleshooting

### Still Can't Access After Disabling Proxy

1. **Check DNS Propagation:**
   ```powershell
   nslookup synapsify.app
   ```
   - If still showing Cloudflare IPs, wait 5-10 minutes
   - DNS can take up to 48 hours, but usually 1-5 minutes

2. **Clear DNS Cache:**
   ```powershell
   # Windows
   ipconfig /flushdns
   ```

3. **Check Firewall:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="iptables -L -n | grep 8090"
   ```
   - Port 8090 should be open (no firewall blocking)

4. **Test from Server:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -k https://104.237.6.152:8090 | head -5"
   ```
   - If this works, the issue is DNS/firewall/network

### Certificate Warning

If you access via IP (`104.237.6.152:8090`), you'll see a certificate warning because the certificate is for `synapsify.app`. This is expected and safe to accept.

## Summary

**The Issue:** Cloudflare proxy is blocking port 8090

**The Fix:** Disable Cloudflare proxy (gray cloud) for synapsify.app A record

**Expected Result:** `https://synapsify.app:8090` will work after DNS propagates

---

**Status:** ⚠️ Waiting for Cloudflare proxy to be disabled  
**Next Step:** Disable proxy in Cloudflare DNS settings  
**Alternative:** Use `https://104.237.6.152:8090` temporarily


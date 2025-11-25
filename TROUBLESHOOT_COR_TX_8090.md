# Troubleshooting cor.tx:8090 Access

## Current Status

✅ SSL certificate issued for `cor.tx`  
✅ Certificate symlinks exist in `/usr/local/lscp/conf/`  
❌ Cannot access CyberPanel via `cor.tx:8090`

## Possible Issues

### 1. DNS Not Resolved (Most Likely)

The domain `cor.tx` may not be resolving correctly. Check:

**From your local machine:**
```powershell
nslookup cor.tx
# Should return: 104.237.6.152
```

**From server:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="getent hosts cor.tx"
```

**Solution:**
- Ensure DNS A record for `cor.tx` points to `104.237.6.152`
- Wait for DNS propagation (can take up to 48 hours, usually 1-2 hours)
- Use IP address temporarily: `https://104.237.6.152:8090`

### 2. Cloudflare Proxy Blocking Port 8090

If you're using Cloudflare, port 8090 is blocked by default.

**Solution:**
- In Cloudflare DNS settings, set the proxy status to **DNS only** (gray cloud) for `cor.tx`
- Or access via IP: `https://104.237.6.152:8090`

### 3. Firewall Blocking Port 8090

Check if firewall allows port 8090:

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ufw status | grep 8090"
```

**Solution:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ufw allow 8090/tcp && ufw reload"
```

### 4. CyberPanel Service Not Using SSL

CyberPanel might not be configured to use SSL on port 8090.

**Check certificate symlinks:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /usr/local/lscp/conf/cert.pem /usr/local/lscp/conf/key.pem"
```

**Solution:**
If symlinks don't exist or are broken, create them:
```bash
ln -sf /etc/letsencrypt/live/cor.tx/fullchain.pem /usr/local/lscp/conf/cert.pem
ln -sf /etc/letsencrypt/live/cor.tx/privkey.pem /usr/local/lscp/conf/key.pem
systemctl restart lscpd
```

### 5. Browser Cache/Certificate Issues

Your browser might be caching the old self-signed certificate.

**Solution:**
- Clear browser cache
- Try incognito/private mode
- Or use a different browser

## Verification Steps

### Step 1: Test from Server

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -k -I https://localhost:8090 2>&1 | head -5"
```

If this works, the issue is DNS/firewall/network related.

### Step 2: Test DNS Resolution

**From your local machine:**
```powershell
nslookup cor.tx
ping cor.tx
```

**From server:**
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="getent hosts cor.tx"
```

### Step 3: Check Certificate

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="openssl x509 -in /usr/local/lscp/conf/cert.pem -noout -subject -issuer 2>/dev/null"
```

Should show `cor.tx` in the subject.

### Step 4: Check Port Accessibility

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 8090"
```

Should show: `0.0.0.0:8090` listening

## Quick Fix Script

Run this to fix common issues:

```powershell
# Ensure certificate symlinks exist
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ln -sf /etc/letsencrypt/live/cor.tx/fullchain.pem /usr/local/lscp/conf/cert.pem && ln -sf /etc/letsencrypt/live/cor.tx/privkey.pem /usr/local/lscp/conf/key.pem"

# Ensure port 8090 is open
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ufw allow 8090/tcp 2>/dev/null; ufw reload"

# Restart CyberPanel
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart lscpd"
```

## Access Methods

### Method 1: Via Domain (After DNS Propagates)
```
https://cor.tx:8090
```

### Method 2: Via IP Address (Works Immediately)
```
https://104.237.6.152:8090
```

### Method 3: Add to Hosts File (Temporary)

On your local machine, edit `C:\Windows\System32\drivers\etc\hosts`:
```
104.237.6.152    cor.tx
```

Then access: `https://cor.tx:8090`

## Next Steps

1. ✅ Verify DNS is pointing to server IP
2. ✅ Check if using Cloudflare (disable proxy if so)
3. ✅ Ensure firewall allows port 8090
4. ✅ Verify certificate symlinks exist
5. ✅ Restart CyberPanel service
6. ✅ Test access via IP first, then domain

---

**Server IP:** 104.237.6.152  
**Domain:** cor.tx  
**Port:** 8090



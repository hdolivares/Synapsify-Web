# CyberPanel Configuration for synapsify.app

## ✅ Configuration Complete

CyberPanel has been successfully configured to use `synapsify.app` SSL certificate for port 8090.

## Current Configuration

- **Domain:** synapsify.app
- **SSL Certificate:** Let's Encrypt (valid until Feb 3, 2026)
- **Certificate Location:** `/etc/letsencrypt/live/synapsify.app/`
- **CyberPanel Certificate Symlinks:**
  - `/usr/local/lscp/conf/cert.pem` → `/etc/letsencrypt/live/synapsify.app/fullchain.pem`
  - `/usr/local/lscp/conf/key.pem` → `/etc/letsencrypt/live/synapsify.app/privkey.pem`

## Access CyberPanel

**Primary URL:**
```
https://synapsify.app:8090
```

**Alternative (via IP):**
```
https://104.237.6.152:8090
```

**Login Credentials:**
- Username: `admin`
- Password: (your CyberPanel password)

## Verification

### Check Certificate
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="openssl x509 -in /usr/local/lscp/conf/cert.pem -noout -subject -issuer"
```

Should show:
- Subject: `CN = synapsify.app`
- Issuer: `Let's Encrypt`

### Check Symlinks
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /usr/local/lscp/conf/cert.pem /usr/local/lscp/conf/key.pem"
```

### Check Service Status
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl status lscpd"
```

## What Was Changed

1. ✅ Updated certificate symlinks from `cor.tx` to `synapsify.app`
2. ✅ Restarted CyberPanel service
3. ✅ Verified certificate is valid and properly configured

## Notes

- **cor.tx:** Was a Handshake TLD and cannot be used for regular websites
- **synapsify.app:** Standard domain that works with Let's Encrypt and standard DNS
- The SSL certificate for `synapsify.app` was already issued and valid
- CyberPanel now uses the `synapsify.app` certificate for secure access

## Troubleshooting

### Cannot Access synapsify.app:8090

1. **Check DNS:**
   ```powershell
   nslookup synapsify.app
   ```
   Should return: `104.237.6.152`

2. **Check if using Cloudflare:**
   - If using Cloudflare, ensure proxy is disabled (gray cloud) for `synapsify.app`
   - Cloudflare blocks port 8090 by default

3. **Check Firewall:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 8090"
   ```
   Should show: `0.0.0.0:8090` listening

4. **Test Localhost:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl -k https://localhost:8090"
   ```
   If this works, the issue is DNS/firewall/network related

### Certificate Issues

If you see certificate errors:

1. **Verify symlinks:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="readlink /usr/local/lscp/conf/cert.pem"
   ```
   Should point to: `/etc/letsencrypt/live/synapsify.app/fullchain.pem`

2. **Recreate symlinks if needed:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ln -sf /etc/letsencrypt/live/synapsify.app/fullchain.pem /usr/local/lscp/conf/cert.pem && ln -sf /etc/letsencrypt/live/synapsify.app/privkey.pem /usr/local/lscp/conf/key.pem && systemctl restart lscpd"
   ```

## Next Steps

1. ✅ Access CyberPanel at `https://synapsify.app:8090`
2. ✅ Manage websites, databases, and email through CyberPanel
3. ✅ Set up additional websites as needed
4. ✅ Configure email accounts for synapsify.app

---

**Server IP:** 104.237.6.152  
**Domain:** synapsify.app  
**CyberPanel Port:** 8090  
**Status:** ✅ Configured and Running


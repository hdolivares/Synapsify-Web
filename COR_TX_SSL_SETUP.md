# Secure SSL Setup for cor.tx CyberPanel Access

This guide solves the SSL chicken-and-egg problem: you need SSL to securely access CyberPanel, but you need to access CyberPanel to configure SSL.

## Solution: Two-Step Process

### Phase 1: Initial Access (Self-Signed Certificate)

**Step 1: Access CyberPanel via IP Address**

1. Open your browser and navigate to:
   ```
   https://104.237.6.152:8090
   ```

2. **You will see a security warning** about the self-signed certificate. This is normal and safe for initial setup.

3. **Accept the warning:**
   - **Chrome/Edge:** Click "Advanced" → "Proceed to 104.237.6.152 (unsafe)"
   - **Firefox:** Click "Advanced" → "Accept the Risk and Continue"
   - **Safari:** Click "Show Details" → "visit this website"

4. Log in with:
   - **Username:** `admin`
   - **Password:** (your CyberPanel password)

### Phase 2: Configure SSL for cor.tx

**Step 2: Create Website in CyberPanel**

1. In CyberPanel, go to: **Websites** → **Create Website**
2. Fill in the form:
   - **Domain Name:** `cor.tx`
   - **Email:** `hobeja7@gmail.com`
   - **Package:** `Default`
   - **PHP Version:** `82` (PHP 8.2) or latest
   - **Create FTP Account:** Yes (optional)
   - **Create Database:** Yes (optional)
3. Click **Create Website**

**Step 3: Issue SSL Certificate**

1. Go to: **Websites** → **List Websites**
2. Find `cor.tx` and click **Manage**
3. Scroll to **SSL** section
4. Click **Issue SSL**
5. Configure:
   - **SSL Provider:** `Let's Encrypt`
   - **Email:** `hobeja7@gmail.com`
   - **Domain:** `cor.tx` (should be pre-filled)
6. Click **Issue SSL**
7. Wait 1-2 minutes for certificate issuance

**Why this works:** Let's Encrypt validation uses port 80 (HTTP), which is already open. The certificate is issued for the website, not for CyberPanel itself.

### Phase 3: Configure CyberPanel to Use cor.tx SSL

**Step 4: Configure CyberPanel SSL (Command Line)**

After the SSL certificate is issued for `cor.tx`, we need to configure CyberPanel to use it:

```powershell
# Run the automated script
.\setup-cor-tx-ssl-secure.ps1
```

Or manually via SSH:

```bash
# SSH into server
ssh root@104.237.6.152

# Copy SSL certificate to CyberPanel directory
mkdir -p /usr/local/lsws/conf/cert/cyberpanel
cp /usr/local/lsws/conf/cert/cor.tx/cert.pem /usr/local/lsws/conf/cert/cyberpanel/cert.pem
cp /usr/local/lsws/conf/cert/cor.tx/key.pem /usr/local/lsws/conf/cert/cyberpanel/key.pem

# Update OpenLiteSpeed configuration
nano /usr/local/lsws/conf/httpd_config.conf
```

Add or update the CyberPanel listener:

```apache
listener CyberPanel {
    address                 *:8090
    secure                  1
    keyFile                 /usr/local/lsws/conf/cert/cyberpanel/key.pem
    certFile                /usr/local/lsws/conf/cert/cyberpanel/cert.pem
    map                     cor.tx cor.tx
    map                     * *
}
```

Restart OpenLiteSpeed:

```bash
systemctl restart lsws
```

## Final Result

After completing all steps:

✅ **CyberPanel accessible at:** `https://cor.tx:8090` (with valid SSL certificate)  
✅ **Website accessible at:** `https://cor.tx` (with valid SSL certificate)  
✅ **No more security warnings!**

## Alternative: Use CyberPanel's SSL Management

CyberPanel may have a built-in way to manage SSL for the control panel itself:

1. In CyberPanel, go to: **SSL** → **Manage SSL**
2. Look for options to configure SSL for the control panel
3. Select `cor.tx` certificate if available

## Troubleshooting

### SSL Certificate Not Issued

**Problem:** Let's Encrypt validation fails

**Solutions:**
1. Ensure DNS for `cor.tx` points to `104.237.6.152`
2. Check that port 80 is open: `netstat -tlnp | grep :80`
3. Verify domain resolves: `nslookup cor.tx`
4. Check CyberPanel logs: `/usr/local/CyberCP/logs/error.log`

### Cannot Access After SSL Configuration

**Problem:** `https://cor.tx:8090` doesn't work after configuration

**Solutions:**
1. Check OpenLiteSpeed status: `systemctl status lsws`
2. Verify certificate files exist:
   ```bash
   ls -la /usr/local/lsws/conf/cert/cyberpanel/
   ```
3. Check OpenLiteSpeed configuration:
   ```bash
   grep -A 10 "listener.*8090" /usr/local/lsws/conf/httpd_config.conf
   ```
4. Check OpenLiteSpeed error logs:
   ```bash
   tail -50 /usr/local/lsws/logs/error.log
   ```

### Certificate Mismatch Warning

**Problem:** Browser shows certificate mismatch for `cor.tx:8090`

**Solutions:**
1. Ensure the listener maps `cor.tx` correctly
2. Verify certificate is for `cor.tx` domain:
   ```bash
   openssl x509 -in /usr/local/lsws/conf/cert/cyberpanel/cert.pem -text -noout | grep -A 2 "Subject:"
   ```
3. Restart OpenLiteSpeed: `systemctl restart lsws`

## Security Notes

1. **Initial Access:** The self-signed certificate warning is safe to accept for initial setup on your own server
2. **After SSL Setup:** Once configured, always use `https://cor.tx:8090` for secure access
3. **Certificate Renewal:** Let's Encrypt certificates expire every 90 days. CyberPanel should auto-renew them, but verify in **SSL** → **Manage SSL**

## Quick Reference

**Initial Access (One-Time):**
- URL: `https://104.237.6.152:8090`
- Accept self-signed certificate warning
- Username: `admin`

**After SSL Setup:**
- URL: `https://cor.tx:8090`
- No warnings, fully secure
- Username: `admin`

---

**Server IP:** 104.237.6.152  
**Domain:** cor.tx  
**CyberPanel Port:** 8090


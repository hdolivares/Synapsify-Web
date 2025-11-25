# Setting Up cor.tx Domain with SSL for CyberPanel Access

This guide will help you configure `cor.tx` domain to access CyberPanel with SSL certificate.

## Prerequisites

- CyberPanel is installed and running
- Domain `cor.tx` DNS points to server IP: `104.237.6.152`
- Access to CyberPanel web interface

## Method 1: Via CyberPanel Web Interface (Recommended)

### Step 1: Create Website in CyberPanel

1. **Access CyberPanel:**
   - URL: `https://104.237.6.152:8090`
   - Username: `admin`
   - Password: (your CyberPanel password)

2. **Create Website:**
   - Navigate to: **Websites** → **Create Website**
   - **Domain Name:** `cor.tx`
   - **Email:** `hobeja7@gmail.com`
   - **Package:** `Default`
   - **PHP Version:** `82` (PHP 8.2) or latest
   - **Create FTP Account:** Yes (optional)
   - **Create Database:** Yes (optional)
   - Click **Create Website**

### Step 2: Issue SSL Certificate

1. **Navigate to Website Management:**
   - Go to: **Websites** → **List Websites**
   - Find `cor.tx` and click **Manage**

2. **Issue SSL Certificate:**
   - Scroll to **SSL** section
   - Click **Issue SSL**
   - **SSL Provider:** Select `Let's Encrypt`
   - **Email:** `hobeja7@gmail.com`
   - **Domain:** `cor.tx` (should be pre-filled)
   - Click **Issue SSL**
   - Wait for certificate to be issued (1-2 minutes)

### Step 3: Access CyberPanel via Domain

CyberPanel runs on port 8090. After DNS propagates, you can access it at:

**URL:** `https://cor.tx:8090`

**Note:** The SSL certificate for `cor.tx` will secure the website, but CyberPanel itself runs on port 8090. You'll need to access it via `cor.tx:8090`.

## Method 2: Command Line Setup

If you prefer command line, you can use CyberPanel's API or direct configuration:

### Create Website via Command Line

```powershell
# SSH into server and run:
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /usr/local/CyberCP && python3 manage.py createWebsite --domainName cor.tx --email hobeja7@gmail.com --package Default --phpVersion 82"
```

### Issue SSL via Command Line

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /usr/local/CyberCP && python3 manage.py issueSSL --domainName cor.tx --email hobeja7@gmail.com"
```

## Method 3: Configure OpenLiteSpeed Directly

If you want to access CyberPanel at `https://cor.tx` (without port 8090), you'll need to set up a reverse proxy:

### Option A: Access via cor.tx:8090 (Simpler)

This is the easiest approach:
1. Create website `cor.tx` in CyberPanel (as above)
2. Issue SSL certificate
3. Access CyberPanel at: `https://cor.tx:8090`

### Option B: Access via cor.tx (Reverse Proxy)

To access CyberPanel at `https://cor.tx` (without port), configure OpenLiteSpeed:

1. **Edit OpenLiteSpeed Configuration:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nano /usr/local/lsws/conf/vhosts/cor.tx/vhconf.conf"
   ```

2. **Add Reverse Proxy Configuration:**
   Add this to the virtual host configuration:
   ```apache
   context /cyberpanel {
       type                    proxy
       handler                 lsphp
       addDefaultCharset       off
       
       # Proxy to CyberPanel
       map                     /cyberpanel https://127.0.0.1:8090/
   }
   ```

3. **Restart OpenLiteSpeed:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart lsws"
   ```

4. **Access at:** `https://cor.tx/cyberpanel`

## Verifying Setup

### Check DNS Resolution

```powershell
# From your local machine
nslookup cor.tx

# Should return: 104.237.6.152
```

### Check Website Directory

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /home/cor.tx/public_html"
```

### Check SSL Certificate

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /usr/local/lsws/conf/cert/cor.tx/"
```

### Test SSL Certificate

```powershell
# From your local machine
curl -I https://cor.tx

# Should show SSL certificate information
```

## Troubleshooting

### DNS Not Resolving

If `cor.tx` doesn't resolve:
1. Check DNS settings at your domain registrar
2. Ensure A record points to `104.237.6.152`
3. Wait for DNS propagation (can take up to 48 hours, usually 1-2 hours)

### SSL Certificate Fails

If SSL certificate issuance fails:
1. Ensure DNS is pointing to the server
2. Check that port 80 is open (required for Let's Encrypt validation)
3. Verify domain is accessible: `curl http://cor.tx`
4. Check CyberPanel logs: `/usr/local/CyberCP/logs/error.log`

### Cannot Access CyberPanel

1. **Check if CyberPanel is running:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl status lscpd"
   ```

2. **Check port 8090:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep 8090"
   ```

3. **Check firewall:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ufw status | grep 8090"
   ```

4. **Open port 8090 if needed:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ufw allow 8090/tcp"
   ```

## Quick Setup Script

Run the automated setup script:

```powershell
.\setup-cor-tx-cyberpanel.ps1
```

This script will:
1. Create website `cor.tx` in CyberPanel
2. Issue SSL certificate
3. Configure OpenLiteSpeed
4. Verify setup

## Final Access URLs

After setup completes:

- **CyberPanel:** `https://cor.tx:8090`
- **Website:** `https://cor.tx`
- **OpenLiteSpeed Admin:** `https://cor.tx:7080` (if configured)

## Next Steps

1. ✅ Create website in CyberPanel
2. ✅ Issue SSL certificate
3. ✅ Verify DNS propagation
4. ✅ Test access to `https://cor.tx:8090`
5. ✅ Change CyberPanel admin password (if not done already)
6. ✅ Set up additional websites as needed

---

**Server IP:** 104.237.6.152  
**Domain:** cor.tx  
**CyberPanel Port:** 8090  
**OpenLiteSpeed Port:** 7080


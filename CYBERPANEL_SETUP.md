# CyberPanel Setup and Access Instructions

## Installation Status

CyberPanel installation is currently **IN PROGRESS** in a screen session on the server.

**Installation Details:**
- **Admin Username:** `admin`
- **Admin Password:** `CyberPanel@2025` (⚠️ **CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN**)
- **Admin Email:** `hobeja7@gmail.com`
- **Web Server:** OpenLiteSpeed
- **Installation Type:** Full installation (includes PowerDNS, Postfix, Pure-FTPd)

## Monitoring Installation Progress

### Check Installation Status

```powershell
# Check if installation is still running
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ps aux | grep -E 'cyberpanel|install.sh' | grep -v grep"

# View installation progress (attach to screen session)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="screen -r cyberpanel-install"

# Check if CyberPanel is installed
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /usr/local/CyberCP/ 2>/dev/null && echo 'Installed' || echo 'Not yet installed'"

# Check if ports are active (8090 = CyberPanel, 7080 = OpenLiteSpeed)
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="netstat -tlnp | grep -E ':8090|:7080'"
```

### Expected Installation Time

- **Typical Duration:** 15-30 minutes
- **Factors:** Server speed, internet connection, package downloads

## Accessing CyberPanel

Once installation completes, access CyberPanel at:

**URL:** `https://104.237.6.152:8090`

**Login Credentials:**
- **Username:** `admin`
- **Password:** `CyberPanel@2025`

⚠️ **SECURITY:** Change the admin password immediately after first login!

## Post-Installation Steps

### 1. Change Admin Password

1. Log into CyberPanel
2. Go to **User** → **Change Password**
3. Set a strong, unique password

### 2. Configure Firewall

CyberPanel requires these ports to be open:
- **8090** - CyberPanel web interface
- **7080** - OpenLiteSpeed web interface
- **80** - HTTP
- **443** - HTTPS
- **21** - FTP
- **25** - SMTP (Email)
- **587** - SMTP Submission (Email)
- **465** - SMTPS (Email)
- **993** - IMAPS (Email)
- **995** - POP3S (Email)
- **53** - DNS (if using PowerDNS)

### 3. Set Up Your First Website

1. In CyberPanel, go to **Websites** → **Create Website**
2. Enter your domain name
3. Select PHP version (recommended: PHP 8.1 or 8.2)
4. Choose to create FTP account and database
5. Click **Create Website**

### 4. Install WordPress (Optional)

1. After creating a website, go to **Websites** → **List Websites**
2. Click **Manage** next to your website
3. Scroll to **Application Installer**
4. Select **WordPress** and follow the installation wizard

## Managing Multiple Websites

CyberPanel allows you to:
- Host unlimited websites
- Create separate email accounts for each domain
- Manage databases for each website
- Install various applications (WordPress, Joomla, etc.)
- Set up SSL certificates (Let's Encrypt)

## Rebuilding Synapsify-Web

When you're ready to rebuild the Synapsify-Web project:

1. **Create Website in CyberPanel:**
   - Go to **Websites** → **Create Website**
   - Domain: `synapsify.com` (or your domain)
   - Select PHP version and create database

2. **Clone Repository:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.com/public_html && git clone https://github.com/hdolivares/Synapsify-Web.git ."
   ```

3. **Install Dependencies:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="cd /home/synapsify.com/public_html && npm install"
   ```

4. **Build and Configure:**
   - Configure Next.js for production
   - Set up environment variables
   - Configure OpenLiteSpeed to serve Next.js properly

## Email Management

CyberPanel includes:
- **Postfix** - SMTP server for sending emails
- **Dovecot** - IMAP/POP3 server for receiving emails
- **Roundcube** - Webmail interface (accessible at `https://your-domain.com/webmail`)

### Create Email Account

1. Go to **Email** → **Create Email Account**
2. Enter email address and password
3. Set mailbox quota
4. Click **Create Email Account**

## Troubleshooting

### Installation Stuck or Failed

```powershell
# Check installation logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -100 /var/log/cyberpanel-install.log"

# View screen session output
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="screen -r cyberpanel-install"
```

### Cannot Access CyberPanel

1. Check if ports are open in firewall
2. Verify installation completed successfully
3. Check OpenLiteSpeed status: `systemctl status lsws`

### Reset Installation

If installation fails, you can restart:

```powershell
# Stop current installation
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="screen -S cyberpanel-install -X quit"

# Clean up and restart
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="rm -rf /usr/local/CyberCP && screen -dmS cyberpanel-install /tmp/cyberpanel-auto.exp"
```

## Useful Commands

```powershell
# Check CyberPanel service status
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl status lsws"

# Restart OpenLiteSpeed
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl restart lsws"

# View CyberPanel logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -50 /usr/local/lsws/logs/error.log"
```

## Next Steps

1. ✅ Wait for installation to complete (check status periodically)
2. ✅ Access CyberPanel at `https://104.237.6.152:8090`
3. ✅ Change admin password immediately
4. ✅ Configure firewall rules
5. ✅ Create your first website
6. ✅ Set up email accounts as needed
7. ✅ Rebuild Synapsify-Web when ready

---

**Installation Started:** November 23, 2025
**Server IP:** 104.237.6.152
**Installation Method:** Automated via expect script


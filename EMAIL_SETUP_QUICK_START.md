# Email Setup Quick Start Guide

## 🎯 Goal
Set up proper rDNS/PTR records and email configuration for `mapio.ai` and `synapsify.app` domains.

## ⚡ Quick Actions Required

### 1. DNS Configuration (In Your DNS Provider - Cloudflare/Namecheap/etc.)

**⚠️ CRITICAL:** `mail.mapio.ai` MUST be DNS-only (gray cloud), NOT proxied!

#### For mapio.ai:

```
Type: A
Name: mail
Content: 104.237.6.152
Proxy: OFF (DNS only - gray cloud)
TTL: Auto

Type: TXT
Name: @
Content: v=spf1 ip4:104.237.6.152 a:mail.mapio.ai ~all
TTL: Auto

Type: MX
Name: @
Priority: 10
Value: mail.mapio.ai
```

#### For synapsify.app (if sending emails):

```
Type: A
Name: mail
Content: 104.237.6.152
Proxy: OFF (DNS only)
TTL: Auto

Type: TXT
Name: @
Content: v=spf1 ip4:104.237.6.152 a:mail.synapsify.app ~all
TTL: Auto
```

### 2. Request rDNS/PTR Record from VPSDime Support

**⚠️ IMPORTANT:** VPSDime requires you to contact their support team - there's no self-service control panel for rDNS.

**Prerequisites:**
- ✅ `mail.mapio.ai` A record must already point to `104.237.6.152` (from Step 1)
- ✅ Forward DNS must be configured BEFORE requesting rDNS

**Steps:**

1. **Log into VPSDime:** https://www.vpsdime.com/clientarea.php
2. **Go to:** Support → Submit Ticket
3. **Subject:** "Request Reverse DNS (PTR) Record Setup"
4. **Copy and paste this message:**

```
Hello VPSDime Support,

I would like to request a reverse DNS (PTR) record setup for my VPS.

Details:
- IP Address: 104.237.6.152
- Reverse DNS Hostname: mail.mapio.ai
- Forward DNS: mail.mapio.ai already resolves to 104.237.6.152 (verified)

This is required for proper email delivery from my mail server running Postfix.

Thank you!
```

5. **Submit ticket and wait:** 24-48 hours for VPSDime to configure it

**⏱️ Wait Time:** 24-48 hours after ticket submission

### 3. Configure Postfix on Server

Run the configuration script:

```powershell
.\configure-email-postfix.ps1
```

This will:
- Set Postfix hostname to `mail.mapio.ai`
- Set domain to `mapio.ai`
- Restart Postfix service

### 4. Generate DKIM Keys (CyberPanel)

1. Log into CyberPanel: `https://104.237.6.152:8090`
2. Go to **Email** → **DKIM Keys**
3. Select domain: `mapio.ai`
4. Click **Generate DKIM Key**
5. Copy the TXT record and add it to your DNS provider

### 5. Verify Everything Works

Run the verification script:

```powershell
.\verify-email-config.ps1
```

Or test manually:

```powershell
# Check forward DNS
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="dig +short mail.mapio.ai"
# Should return: 104.237.6.152

# Check reverse DNS
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="dig +short -x 104.237.6.152"
# Should return: mail.mapio.ai
```

## 📊 Current Status

- ✅ **VPS IP:** `104.237.6.152`
- ✅ **Postfix:** Installed (via CyberPanel)
- ❌ **rDNS/PTR:** Not configured (needs VPS provider setup)
- ⚠️ **DNS:** Need to verify `mail.mapio.ai` is DNS-only (not proxied)

## 🔍 Testing Email Deliverability

1. **Mail-Tester:** https://www.mail-tester.com/
   - Send test email, get score (aim for 10/10)

2. **MXToolbox:** https://mxtoolbox.com/
   - Check rDNS: Enter `104.237.6.152`
   - Check SPF: Enter `mapio.ai`

3. **Google Postmaster Tools:** https://postmaster.google.com/
   - Verify domain and monitor reputation

## ⚠️ Common Issues

### Issue: Emails going to spam
**Solution:** Ensure all records are configured:
- ✅ rDNS matches forward DNS
- ✅ SPF record exists
- ✅ DKIM signing enabled
- ✅ DMARC policy set

### Issue: Cannot send emails
**Solution:** 
- Check port 25 is open
- Verify Postfix is running: `systemctl status postfix`
- Check logs: `tail -f /var/log/mail.log`

### Issue: rDNS not working
**Solution:**
- Wait 24-48 hours after requesting
- Verify forward DNS is correct first
- Contact VPS provider if still not working

## 📝 Recommended Email Setup

### For mapio.ai (Primary Email Domain):

1. **rDNS:** `mail.mapio.ai` ← `104.237.6.152`
2. **A Record:** `mail.mapio.ai` → `104.237.6.152` (DNS-only)
3. **MX Record:** `mapio.ai` → `mail.mapio.ai` (priority 10)
4. **SPF:** `v=spf1 ip4:104.237.6.152 a:mail.mapio.ai ~all`
5. **DKIM:** Generated via CyberPanel
6. **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@mapio.ai`

### For synapsify.app (Secondary Domain):

1. **A Record:** `mail.synapsify.app` → `104.237.6.152` (DNS-only)
2. **SPF:** `v=spf1 ip4:104.237.6.152 a:mail.synapsify.app ~all`
3. **DKIM:** Generate in CyberPanel if needed
4. **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@synapsify.app`

**Note:** Both domains can use the same mail server (`mail.mapio.ai`), but rDNS should point to the primary domain.

---

**Need Help?** See `EMAIL_RDNS_SETUP.md` for detailed instructions.


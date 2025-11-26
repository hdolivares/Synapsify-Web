# VPSDime rDNS/PTR Record Support Ticket Template

## How to Request Reverse DNS from VPSDime

VPSDime does **not** have a self-service control panel for reverse DNS. You must contact their support team via ticket.

## Prerequisites

**⚠️ CRITICAL:** Before requesting rDNS, you MUST:

1. ✅ Configure forward DNS first:
   - `mail.mapio.ai` A record → `104.237.6.152`
   - This must be DNS-only (not proxied through Cloudflare)
   - Wait for DNS propagation (can take a few hours)

2. ✅ Verify forward DNS is working:
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="dig +short mail.mapio.ai"
   # Should return: 104.237.6.152
   ```

## Step-by-Step Instructions

### Step 1: Log into VPSDime

1. Go to: https://www.vpsdime.com/clientarea.php
2. Log in with your VPSDime account credentials

### Step 2: Open Support Ticket

1. Click on **Support** in the top menu
2. Click **Submit Ticket**
3. Select **Technical Support** or **General Inquiry**

### Step 3: Fill Out Ticket Form

**Subject:**
```
Request Reverse DNS (PTR) Record Setup
```

**Message:**
```
Hello VPSDime Support,

I would like to request a reverse DNS (PTR) record setup for my VPS.

Server Details:
- IP Address: 104.237.6.152
- Requested Reverse DNS Hostname: mail.mapio.ai

Forward DNS Verification:
- mail.mapio.ai already resolves to 104.237.6.152 (verified)
- A record is configured and propagated

Purpose:
This reverse DNS record is required for proper email delivery from my mail server (Postfix) running on this VPS. Without proper rDNS, emails may be marked as spam or rejected by receiving mail servers.

Please configure the PTR record for IP 104.237.6.152 to point to mail.mapio.ai.

Thank you for your assistance!

Best regards,
[Your Name]
```

**Priority:** Normal

### Step 4: Submit and Wait

1. Click **Submit Ticket**
2. You'll receive a ticket confirmation email
3. **Wait 24-48 hours** for VPSDime support to configure the rDNS record
4. You'll receive an email notification when it's complete

## After rDNS is Configured

### Verify rDNS is Working

```powershell
# Check reverse DNS
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="dig +short -x 104.237.6.152"
# Should return: mail.mapio.ai
```

### Test Email Configuration

Run the verification script:

```powershell
.\verify-email-config.ps1
```

## Troubleshooting

### If rDNS Doesn't Work After 48 Hours

1. **Reply to the support ticket** asking for status update
2. **Verify forward DNS** is still correct:
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="dig +short mail.mapio.ai"
   ```

3. **Check if rDNS was set to different hostname:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" "-profile=.\synapsify.tlp" -cmd="dig +short -x 104.237.6.152"
   ```

### Common Issues

**Issue:** VPSDime says forward DNS doesn't match
- **Solution:** Ensure `mail.mapio.ai` A record is configured and propagated before requesting

**Issue:** rDNS points to wrong hostname
- **Solution:** Open a new ticket requesting correction

**Issue:** rDNS not propagating
- **Solution:** Wait 24-48 hours, DNS changes can take time to propagate globally

## Alternative: Check VPSDime Knowledge Base

VPSDime has a knowledge base article about rDNS:
- URL: https://vpsdime.com/knowledgebase/27_how-do-i-set-reverse-dns-rdnsorptr

## Quick Reference

**VPSDime Support:**
- Website: https://www.vpsdime.com/clientarea.php
- Support: Support → Submit Ticket
- Knowledge Base: https://vpsdime.com/knowledgebase/

**Your Details:**
- IP Address: `104.237.6.152`
- Reverse DNS: `mail.mapio.ai`
- Forward DNS: `mail.mapio.ai` → `104.237.6.152`

---

**Last Updated:** January 2025
**Provider:** VPSDime


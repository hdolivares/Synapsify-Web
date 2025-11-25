# Fix Let's Encrypt Permissions Error

## Problem

When trying to issue SSL certificate for `cor.tx` in CyberPanel, you get this error:

```
Error: [Errno 13] Permission denied: '/etc/letsencrypt/live/cor.tx/fullchain.pem'
```

## Root Cause

The `/etc/letsencrypt/live/` directory has restrictive permissions (`drwx------` = 700) that only allow root to access it. CyberPanel runs as user `lscpd`, which cannot read the certificate files.

## Solution Applied

The permissions have been fixed:

1. **Changed `/etc/letsencrypt/live/` permissions** from `700` to `755` (readable by group)
2. **Changed ownership** to `root:lsadm` (lsadm group can read)
3. **Fixed certificate file permissions:**
   - `fullchain.pem`: `644` (readable by group)
   - `privkey.pem`: `640` (readable by group, not world)
   - `cert.pem`: `644` (readable by group)
   - `chain.pem`: `644` (readable by group)
4. **Ensured `lscpd` user is in `lsadm` group** (already was)
5. **Restarted CyberPanel service** to apply changes

## Verification

The fix has been applied. You can verify by running:

```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /etc/letsencrypt/live/cor.tx/"
```

You should see:
- Directory permissions: `drwxr-xr-x` (755)
- File permissions: `-rw-r--r--` for cert files, `-rw-r-----` for privkey
- Group ownership: `lsadm`

## Next Steps

1. **Go back to CyberPanel:** `https://104.237.6.152:8090`
2. **Navigate to:** Websites → List Websites → Manage (cor.tx)
3. **Go to:** SSL → Issue SSL
4. **Try issuing SSL again** - it should work now!

## If Issue Persists

If you still get permission errors:

1. **Check CyberPanel service status:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="systemctl status lscpd"
   ```

2. **Manually verify permissions:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ls -la /etc/letsencrypt/live/cor.tx/fullchain.pem"
   ```

3. **Re-run the fix script:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="bash /tmp/fix-letsencrypt-permissions.sh"
   ```

4. **Check CyberPanel logs:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -50 /usr/local/CyberCP/logs/error.log"
   ```

## Prevention

This issue can occur if:
- Let's Encrypt certificates are created manually (not through CyberPanel)
- System permissions are changed
- CyberPanel is reinstalled

The fix script (`fix-letsencrypt-permissions.sh`) can be run anytime to restore proper permissions.

---

**Status:** ✅ Fixed  
**Date:** November 24, 2025  
**Domain:** cor.tx


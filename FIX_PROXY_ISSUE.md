# Fix Proxy Issue - synapsify.app

## Current Status
- ✅ Next.js app running on port 3001 (PM2)
- ✅ App responds correctly: `curl http://127.0.0.1:3001` returns HTTP 200
- ✅ Proxy context added to vhost.conf
- ❌ OpenLiteSpeed still returning 404 (proxy not working)

## Issue
The proxy context is configured but OpenLiteSpeed is not proxying requests to port 3001.

## Solution: Configure via CyberPanel Web Interface

Since manual configuration isn't working, use CyberPanel's web interface:

1. **Access CyberPanel:**
   - Go to: `https://synapsify.app:8090`
   - Login with your admin credentials

2. **Navigate to Website Settings:**
   - Go to: **Websites** → **List Websites**
   - Click **Manage** next to `synapsify.app`

3. **Add Proxy Context:**
   - Go to: **Contexts** tab
   - Click **Add Context**
   - Configure:
     - **URI:** `/`
     - **Type:** `Proxy`
     - **Backend URL:** `http://127.0.0.1:3001`
     - **Headers:** Add if needed:
       - `X-Forwarded-Proto: $scheme`
       - `X-Forwarded-For: $proxy_add_x_forwarded_for`
       - `Host: $host`
   - Click **Save**

4. **Remove/Disable Index Context:**
   - In the same **Contexts** tab
   - Find the index context (if exists)
   - Either remove it or set it to lower priority

5. **Restart OpenLiteSpeed:**
   - Go to: **Server Status** → **Restart** → **OpenLiteSpeed**

## Alternative: Check Current Configuration

The proxy context is currently:
```
context / {
  type                    proxy
  addDefaultCharset       off
  proxy                   http://127.0.0.1:3001
  addHeader               X-Forwarded-Proto $scheme
  addHeader               X-Forwarded-For $proxy_add_x_forwarded_for
  addHeader               Host $host
}
```

This looks correct, but OpenLiteSpeed might need:
- Different handler configuration
- Context priority settings
- Or configuration through CyberPanel's interface

## Verification

After configuring:
```bash
curl -I http://localhost
# Should return HTTP 200 from Next.js app
```

Then test: `https://synapsify.app`


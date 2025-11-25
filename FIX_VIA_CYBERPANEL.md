# Fix Proxy via CyberPanel vHost Conf

## Current Issue
The proxy context is in the config file but OpenLiteSpeed isn't using it. Let's configure it properly through CyberPanel.

## Steps to Fix via CyberPanel

1. **Access CyberPanel:**
   - Go to: `https://synapsify.app:8090`
   - Login with your admin credentials

2. **Navigate to Website Settings:**
   - Go to: **Websites** → **List Websites**
   - Click **Manage** next to `synapsify.app`

3. **Edit vHost Conf:**
   - Click on **vHost Conf** tab
   - Look for the `context / {` section (around line 28)
   - Make sure it looks exactly like this:

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

4. **Important:** Make sure:
   - The context `/` comes BEFORE `scripthandler {`
   - There are no syntax errors
   - The proxy URL is exactly: `http://127.0.0.1:3001`

5. **Save and Restart:**
   - Click **Save** in CyberPanel
   - Go to **Server Status** → **Restart** → **OpenLiteSpeed**
   - Or use: **Server Status** → **Graceful Restart**

6. **Test:**
   - Visit: `https://synapsify.app`
   - Should show your Next.js app

## Alternative: Remove docRoot Override

If the above doesn't work, try changing the `docRoot` setting:
- In vHost Conf, find: `docRoot $VH_ROOT/public_html`
- Change it to: `docRoot $SERVER_ROOT/Example/html` (or comment it out)
- This ensures the proxy context takes precedence over static files

## If Still Not Working

The proxy context might need to be configured with a different handler. Try adding this inside the context block:

```
context / {
  type                    proxy
  handler                 lsphp
  addDefaultCharset       off
  proxy                   http://127.0.0.1:3001
  addHeader               X-Forwarded-Proto $scheme
  addHeader               X-Forwarded-For $proxy_add_x_forwarded_for
  addHeader               Host $host
}
```

Note: We tried without `handler lsphp` but it might be needed.


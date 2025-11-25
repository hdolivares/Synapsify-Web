# Fix 500 Error - External Application Configuration

## Root Cause
The error was:
```
[ERROR] Proxy target is not defined on external application list, please add a 'web server' with name '127.0.0.1:3001'
```

OpenLiteSpeed requires proxy targets to be registered as "external applications" before they can be used in proxy contexts.

## Solution Applied
Added external application definition to `/usr/local/lsws/conf/httpd_config.conf`:

```
extapp 127.0.0.1:3001 {
  type                    proxy
  address                 http://127.0.0.1:3001
  maxConns                100
  retryTimeout            0
  respBuffer              0
  pcKeepAliveTimeout      60
  initTimeout              60
  retryTimeout             0
}
```

## Next Steps
The proxy context in vHost config might need to reference the external app by name. 

In CyberPanel vHost Conf, try changing the proxy line from:
```
proxy                   http://127.0.0.1:3001
```

To reference the external app name:
```
proxy                   127.0.0.1:3001
```

Or the context might need to use a different format. Check OpenLiteSpeed documentation for proxy context with external apps.


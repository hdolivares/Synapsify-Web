#!/bin/bash
VHOST_CONF="/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf"
BACKUP="${VHOST_CONF}.backup.final"

cp "$VHOST_CONF" "$BACKUP"

# Create proxy context block
cat > /tmp/proxy_block.txt << 'PROXYEOF'
context / {
  type                    proxy
  handler                 lsphp
  addDefaultCharset       off
  proxy                   http://127.0.0.1:3001
  addHeader               X-Forwarded-Proto $scheme
  addHeader               X-Forwarded-For $proxy_add_x_forwarded_for
  addHeader               Host $host
}

PROXYEOF

# Insert before line 28 (scripthandler)
sed -i '28r /tmp/proxy_block.txt' "$VHOST_CONF"

echo "Proxy context added. Verifying:"
grep -A 8 "context / {" "$VHOST_CONF" | head -10

echo ""
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws
sleep 3
echo "Done!"


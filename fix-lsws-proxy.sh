#!/bin/bash
VHOST_CONF="/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf"
BACKUP="${VHOST_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

# Backup
cp "$VHOST_CONF" "$BACKUP"
echo "Backup created: $BACKUP"

# Check if proxy context already exists
if grep -q "context / {" "$VHOST_CONF" && grep -q "proxy.*3001" "$VHOST_CONF"; then
    echo "Proxy context already exists, removing old one..."
    # Remove existing proxy context
    sed -i '/^context \/ {/,/^}/d' "$VHOST_CONF"
fi

# Disable index context to prevent serving static files
sed -i 's/useServer.*0/useServer               1/' "$VHOST_CONF"

# Add proxy context BEFORE scripthandler (so it takes precedence)
sed -i '/^scripthandler {/i\
context / {\
  type                    proxy\
  handler                 lsphp\
  addDefaultCharset       off\
  proxy                   http://127.0.0.1:3001\
  addHeader               X-Forwarded-Proto $scheme\
  addHeader               X-Forwarded-For $proxy_add_x_forwarded_for\
  addHeader               Host $host\
}\
' "$VHOST_CONF"

echo ""
echo "Configuration updated:"
grep -A 8 "context / {" "$VHOST_CONF" | head -10

echo ""
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws
sleep 2
echo "Done!"
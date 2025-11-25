#!/bin/bash
# Manually add proxy context to OpenLiteSpeed config

VHOST_CONF="/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf"
BACKUP="${VHOST_CONF}.backup.manual2"

cp "$VHOST_CONF" "$BACKUP"
echo "Backup: $BACKUP"

# Find the line number of scripthandler
LINE=$(grep -n "^scripthandler {" "$VHOST_CONF" | cut -d: -f1)

if [ -z "$LINE" ]; then
    echo "ERROR: Could not find scripthandler line"
    exit 1
fi

echo "Found scripthandler at line $LINE"

# Create temp file with proxy context inserted
sed "${LINE}i\\
context / {\\
  type                    proxy\\
  handler                 lsphp\\
  addDefaultCharset       off\\
  proxy                   http://127.0.0.1:3001\\
  addHeader               X-Forwarded-Proto \$scheme\\
  addHeader               X-Forwarded-For \$proxy_add_x_forwarded_for\\
  addHeader               Host \$host\\
}\\
" "$VHOST_CONF" > "${VHOST_CONF}.tmp"

mv "${VHOST_CONF}.tmp" "$VHOST_CONF"

echo ""
echo "Proxy context added. Verifying:"
grep -A 8 "context / {" "$VHOST_CONF" | head -10

echo ""
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws
sleep 3
echo "Done!"


#!/bin/bash
# Fix proxy using extprocessor (forum suggestion)

VHOST_CONF="/usr/local/lsws/conf/vhosts/synapsify.app/vhost.conf"
BACKUP="${VHOST_CONF}.backup.extprocessor"

cp "$VHOST_CONF" "$BACKUP"
echo "Backup created: $BACKUP"

# Remove old proxy context
sed -i '/^context \/ {/,/^}/d' "$VHOST_CONF"

# Add extprocessor before scripthandler
sed -i '/^scripthandler {/i\
extprocessor nextjs {\
  type                    proxy\
  address                 127.0.0.1:3001\
  maxConns                300\
  initTimeout             60\
  retryTimeout            60\
  respBuffer              1\
}\
\
' "$VHOST_CONF"

# Add proxy context after extprocessor
sed -i '/^extprocessor nextjs {/,/^}/ {
/^}/a\
\
context / {\
  type                    proxy\
  handler                 nextjs\
  addDefaultCharset       off\
}\
\
}' "$VHOST_CONF"

echo ""
echo "Configuration updated. Verifying:"
grep -A 10 "extprocessor nextjs" "$VHOST_CONF" | head -12
echo ""
grep -A 5 "context / {" "$VHOST_CONF" | head -7

echo ""
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws
sleep 3
echo "Done!"


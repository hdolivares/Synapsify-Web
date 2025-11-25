#!/bin/bash
# Add 127.0.0.1:3001 as external application in OpenLiteSpeed

MAIN_CONF="/usr/local/lsws/conf/httpd_config.conf"
BACKUP="${MAIN_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

cp "$MAIN_CONF" "$BACKUP"
echo "Backup created: $BACKUP"

# Check if external app already exists
if grep -q "extapp.*127.0.0.1:3001" "$MAIN_CONF"; then
    echo "External app 127.0.0.1:3001 already exists"
    exit 0
fi

# Find the listener section and add external app before it
# Or add it in the server section
# OpenLiteSpeed external apps are typically defined in the server context

# Add external app definition
cat >> "$MAIN_CONF" << 'EOF'

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
EOF

echo ""
echo "External app added. Verifying:"
grep -A 10 "extapp 127.0.0.1:3001" "$MAIN_CONF"

echo ""
echo "Restarting OpenLiteSpeed..."
systemctl restart lsws
sleep 3
echo "Done!"


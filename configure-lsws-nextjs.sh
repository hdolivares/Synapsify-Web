#!/bin/bash
# Configure OpenLiteSpeed to proxy synapsify.app to Next.js on port 3001

DOMAIN="synapsify.app"
VHOST_CONF="/usr/local/lsws/conf/vhosts/${DOMAIN}/vhost.conf"
BACKUP="${VHOST_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

echo "Configuring OpenLiteSpeed for Next.js proxy..."
echo ""

# Backup current config
cp "$VHOST_CONF" "$BACKUP"
echo "Backup created: $BACKUP"
echo ""

# Check if proxy context already exists
if grep -q "context / {" "$VHOST_CONF" && grep -q "proxy" "$VHOST_CONF"; then
    echo "Proxy context exists, updating..."
    # Update proxy port
    sed -i 's|proxy.*http://127.0.0.1:[0-9]*|proxy                   http://127.0.0.1:3001|g' "$VHOST_CONF"
else
    echo "Adding proxy context..."
    # Find the line before scripthandler and insert proxy context
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
fi

echo ""
echo "Configuration updated:"
grep -A 8 "context / {" "$VHOST_CONF" | head -10

echo ""
echo "Testing OpenLiteSpeed configuration..."
/usr/local/lsws/bin/lswsctrl configtest

if [ $? -eq 0 ]; then
    echo ""
    echo "Configuration test passed!"
    echo "Restarting OpenLiteSpeed..."
    systemctl restart lsws
    sleep 2
    echo "OpenLiteSpeed restarted"
    echo ""
    echo "Your Next.js app should now be accessible at:"
    echo "  https://${DOMAIN}"
    echo "  http://${DOMAIN}"
else
    echo ""
    echo "ERROR: Configuration test failed!"
    echo "Restoring backup..."
    cp "$BACKUP" "$VHOST_CONF"
    exit 1
fi


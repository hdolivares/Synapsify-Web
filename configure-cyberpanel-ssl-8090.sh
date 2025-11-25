#!/bin/bash
# Configure CyberPanel (port 8090) to use cor.tx SSL certificate

DOMAIN="cor.tx"
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.conf"
BACKUP_FILE="/usr/local/lsws/conf/httpd_config.conf.backup.$(date +%Y%m%d_%H%M%S)"
CERT_SOURCE="/etc/letsencrypt/live/${DOMAIN}"
CERT_DEST="/usr/local/lsws/conf/cert/${DOMAIN}"

echo "Configuring CyberPanel SSL for ${DOMAIN}:8090..."
echo ""

# Backup configuration
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"
echo ""

# Create certificate directory if it doesn't exist
mkdir -p "$CERT_DEST"

# Copy certificate files
if [ -f "${CERT_SOURCE}/fullchain.pem" ] && [ -f "${CERT_SOURCE}/privkey.pem" ]; then
    cp "${CERT_SOURCE}/fullchain.pem" "${CERT_DEST}/cert.pem"
    cp "${CERT_SOURCE}/privkey.pem" "${CERT_DEST}/key.pem"
    
    # Also create chain.pem if needed
    if [ -f "${CERT_SOURCE}/chain.pem" ]; then
        cp "${CERT_SOURCE}/chain.pem" "${CERT_DEST}/chain.pem"
    else
        # Extract chain from fullchain if chain.pem doesn't exist
        openssl x509 -in "${CERT_SOURCE}/fullchain.pem" -out "${CERT_DEST}/chain.pem" -outform PEM 2>/dev/null || true
    fi
    
    chown -R lsadm:lsadm "$CERT_DEST"
    chmod 644 "${CERT_DEST}/cert.pem"
    chmod 640 "${CERT_DEST}/key.pem"
    
    echo "Certificate files copied to: $CERT_DEST"
else
    echo "ERROR: Certificate files not found in $CERT_SOURCE"
    exit 1
fi

echo ""

# Check if listener for 8090 exists
if grep -q "listener.*8090\|address.*8090" "$CONFIG_FILE"; then
    echo "Listener for port 8090 found, updating configuration..."
    
    # Update existing listener configuration
    # First, let's see what we have
    LISTENER_LINE=$(grep -n "listener.*8090\|address.*8090" "$CONFIG_FILE" | head -1 | cut -d: -f1)
    
    if [ -n "$LISTENER_LINE" ]; then
        echo "Found listener configuration at line $LISTENER_LINE"
    fi
else
    echo "No listener found for port 8090, creating new listener..."
    
    # Add CyberPanel listener before the closing brace of the file or after Default listener
    # Find a good place to insert (after Default listener)
    DEFAULT_LISTENER_END=$(grep -n "^}" "$CONFIG_FILE" | awk -F: '$1 > 50 && $1 < 200 {print $1; exit}')
    
    if [ -n "$DEFAULT_LISTENER_END" ]; then
        INSERT_LINE=$DEFAULT_LISTENER_END
    else
        # Insert before the last closing brace
        INSERT_LINE=$(tail -5 "$CONFIG_FILE" | grep -n "^}" | tail -1 | cut -d: -f1)
        INSERT_LINE=$(($(wc -l < "$CONFIG_FILE") - INSERT_LINE + 1))
    fi
    
    # Create listener configuration
    LISTENER_CONFIG="
listener CyberPanel {
  address                 *:8090
  secure                  1
  keyFile                 ${CERT_DEST}/key.pem
  certFile                ${CERT_DEST}/cert.pem
  map                     ${DOMAIN} ${DOMAIN}
  map                     * *
}
"
    
    # Insert the listener configuration
    sed -i "${INSERT_LINE}i\\${LISTENER_CONFIG}" "$CONFIG_FILE"
    echo "New listener configuration added"
fi

# Update certificate paths in existing listener if it exists
sed -i "s|keyFile.*cyberpanel.*|keyFile                 ${CERT_DEST}/key.pem|g" "$CONFIG_FILE"
sed -i "s|certFile.*cyberpanel.*|certFile                ${CERT_DEST}/cert.pem|g" "$CONFIG_FILE"
sed -i "s|keyFile.*8090.*|keyFile                 ${CERT_DEST}/key.pem|g" "$CONFIG_FILE"
sed -i "s|certFile.*8090.*|certFile                ${CERT_DEST}/cert.pem|g" "$CONFIG_FILE"

# Ensure secure is set to 1 for port 8090
sed -i '/address.*8090/,/}/ s/secure.*0/secure                  1/' "$CONFIG_FILE"
sed -i '/address.*8090/,/}/ s/secure.*1/secure                  1/' "$CONFIG_FILE"

# Add domain mapping if not present
if ! grep -q "map.*${DOMAIN}" "$CONFIG_FILE" | grep -q "8090\|CyberPanel"; then
    # Add domain mapping to the listener
    sed -i "/address.*8090/,/}/ {
        /map.*\* \*/a\\
  map                     ${DOMAIN} ${DOMAIN}
    }" "$CONFIG_FILE"
fi

echo ""
echo "Configuration updated!"
echo ""

# Test configuration
echo "Testing OpenLiteSpeed configuration..."
/usr/local/lsws/bin/lswsctrl configtest

if [ $? -eq 0 ]; then
    echo ""
    echo "Configuration test passed!"
    echo "Restarting OpenLiteSpeed..."
    systemctl restart lsws
    sleep 2
    
    echo ""
    echo "OpenLiteSpeed restarted"
    echo ""
    echo "CyberPanel should now be accessible at:"
    echo "  https://${DOMAIN}:8090"
    echo "  https://104.237.6.152:8090"
    echo ""
    echo "Certificate information:"
    openssl x509 -in "${CERT_DEST}/cert.pem" -noout -subject -issuer 2>/dev/null || echo "Could not read certificate"
else
    echo ""
    echo "ERROR: Configuration test failed!"
    echo "Restoring backup..."
    cp "$BACKUP_FILE" "$CONFIG_FILE"
    exit 1
fi



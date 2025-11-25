#!/bin/bash
# Fix Let's Encrypt permissions for CyberPanel

echo "Fixing Let's Encrypt permissions for CyberPanel..."

# Backup current permissions
echo "Backing up current permissions..."

# Fix /etc/letsencrypt/live directory permissions
# Allow lscpd user and lsadm group to read
chmod 755 /etc/letsencrypt/live
chown root:lsadm /etc/letsencrypt/live

# Fix cor.tx directory permissions
if [ -d "/etc/letsencrypt/live/cor.tx" ]; then
    chmod 755 /etc/letsencrypt/live/cor.tx
    chown root:lsadm /etc/letsencrypt/live/cor.tx
    
    # Fix certificate file permissions
    if [ -f "/etc/letsencrypt/live/cor.tx/fullchain.pem" ]; then
        chmod 644 /etc/letsencrypt/live/cor.tx/fullchain.pem
        chown root:lsadm /etc/letsencrypt/live/cor.tx/fullchain.pem
    fi
    
    if [ -f "/etc/letsencrypt/live/cor.tx/privkey.pem" ]; then
        chmod 640 /etc/letsencrypt/live/cor.tx/privkey.pem
        chown root:lsadm /etc/letsencrypt/live/cor.tx/privkey.pem
    fi
    
    if [ -f "/etc/letsencrypt/live/cor.tx/cert.pem" ]; then
        chmod 644 /etc/letsencrypt/live/cor.tx/cert.pem
        chown root:lsadm /etc/letsencrypt/live/cor.tx/cert.pem
    fi
    
    if [ -f "/etc/letsencrypt/live/cor.tx/chain.pem" ]; then
        chmod 644 /etc/letsencrypt/live/cor.tx/chain.pem
        chown root:lsadm /etc/letsencrypt/live/cor.tx/chain.pem
    fi
fi

# Ensure lscpd user is in lsadm group
usermod -a -G lsadm lscpd 2>/dev/null || echo "User already in group or group doesn't exist"

# Fix archive directory permissions (for renewal)
if [ -d "/etc/letsencrypt/archive" ]; then
    chmod 755 /etc/letsencrypt/archive
    chown root:lsadm /etc/letsencrypt/archive
fi

# Fix accounts directory permissions
if [ -d "/etc/letsencrypt/accounts" ]; then
    chmod 755 /etc/letsencrypt/accounts
    chown root:lsadm /etc/letsencrypt/accounts
fi

echo ""
echo "Permissions fixed!"
echo ""
echo "Current permissions:"
ls -la /etc/letsencrypt/live/ | head -5
if [ -d "/etc/letsencrypt/live/cor.tx" ]; then
    echo ""
    echo "cor.tx directory:"
    ls -la /etc/letsencrypt/live/cor.tx/
fi

echo ""
echo "Note: You may need to restart CyberPanel service for changes to take effect"
echo "Run: systemctl restart lscpd"


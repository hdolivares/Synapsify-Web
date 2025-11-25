#!/bin/bash
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.conf"
BACKUP_FILE="/usr/local/lsws/conf/httpd_config.conf.backup.$(date +%Y%m%d_%H%M%S)"

# Backup config
cp $CONFIG_FILE $BACKUP_FILE
echo "Backup created: $BACKUP_FILE"

# Check if domain already exists
if grep -q "map.*cor.tx" $CONFIG_FILE; then
    echo "Domain cor.tx already exists in listener configuration"
else
    # Add domain to listener Default section (after existing maps)
    sed -i '/listener Default{/,/}/ {
        /map.*synapsify.app/a\
    map                     cor.tx cor.tx
    }' $CONFIG_FILE
    
    echo "Added cor.tx to OpenLiteSpeed listener"
fi

# Verify the change
echo ""
echo "Current listener configuration:"
grep -A 10 "listener Default" $CONFIG_FILE | grep "map"
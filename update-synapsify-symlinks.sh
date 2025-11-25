# Update certificate symlinks to synapsify.app
ln -sf /etc/letsencrypt/live/synapsify.app/fullchain.pem /usr/local/lscp/conf/cert.pem
ln -sf /etc/letsencrypt/live/synapsify.app/privkey.pem /usr/local/lscp/conf/key.pem

# Verify symlinks
echo "Certificate symlinks updated:"
ls -la /usr/local/lscp/conf/cert.pem /usr/local/lscp/conf/key.pem
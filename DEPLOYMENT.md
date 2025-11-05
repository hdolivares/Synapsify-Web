# Deployment Guide for Synapsify-Web

This guide will help you deploy the Synapsify-Web application to your server.

## Prerequisites

- Ubuntu/Debian server (104.237.6.152)
- Root access
- Domain name pointing to your server IP (optional but recommended)

## Step 1: SSH into Your Server

```bash
ssh root@104.237.6.152
# Password: NimbedGrangeIcicleSixain
```

## Step 2: Set Up Git

```bash
# Configure Git
git config --global user.name "hdolivares"
git config --global user.email "hobeja7@gmail.com"

# Set up GitHub authentication
# Option 1: Use PAT (Personal Access Token)
# Replace YOUR_GITHUB_PAT with your actual Personal Access Token
git config --global credential.helper store
echo "https://hdolivares:YOUR_GITHUB_PAT@github.com" > ~/.git-credentials

# Option 2: Clone using PAT in URL (one-time)
# Replace YOUR_GITHUB_PAT with your actual Personal Access Token
git clone https://YOUR_GITHUB_PAT@github.com/hdolivares/Synapsify-Web.git
```

## Step 3: Install Dependencies

```bash
# Update system
apt-get update

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install nginx (for reverse proxy)
apt-get install -y nginx
```

## Step 4: Clone and Build Project

```bash
# Clone repository
cd /root
git clone https://github.com/hdolivares/Synapsify-Web.git
cd Synapsify-Web

# Install project dependencies
npm install

# Build the project
npm run build
```

## Step 5: Configure PM2

```bash
# Start the application with PM2
pm2 start npm --name "synapsify-web" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions it outputs
```

## Step 6: Configure Nginx (Multi-Domain Setup)

```bash
# Copy the nginx configuration
cp nginx-config.conf /etc/nginx/sites-available/synapsify-web

# Edit the configuration to match your domain
nano /etc/nginx/sites-available/synapsify-web
# Update 'server_name' with your actual domain

# Enable the site
ln -s /etc/nginx/sites-available/synapsify-web /etc/nginx/sites-enabled/

# Remove default nginx site (optional)
rm /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Reload nginx
systemctl reload nginx
```

## Step 7: Set Up Firewall (Optional but Recommended)

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## Step 8: Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d synapsify.com -d www.synapsify.com

# Certbot will automatically configure nginx for HTTPS
```

## Multi-Service/Multi-Domain Configuration

### Option 1: Multiple Next.js Apps on Different Ports

1. Deploy each app to a different port (3000, 3001, 3002, etc.)
2. Configure PM2 to manage each service:
   ```bash
   pm2 start npm --name "app1" -- start -- -p 3000
   pm2 start npm --name "app2" -- start -- -p 3001
   ```

3. Create separate nginx server blocks for each domain:
   ```nginx
   # /etc/nginx/sites-available/app1
   server {
       listen 80;
       server_name domain1.com;
       location / {
           proxy_pass http://localhost:3000;
           # ... proxy settings
       }
   }

   # /etc/nginx/sites-available/app2
   server {
       listen 80;
       server_name domain2.com;
       location / {
           proxy_pass http://localhost:3001;
           # ... proxy settings
       }
   }
   ```

### Option 2: Using Docker (Advanced)

For better isolation, you can use Docker containers for each service.

## Useful Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs synapsify-web

# Restart application
pm2 restart synapsify-web

# Stop application
pm2 stop synapsify-web

# Check nginx status
systemctl status nginx

# View nginx logs
tail -f /var/log/nginx/error.log

# Update and redeploy
cd /root/Synapsify-Web
git pull
npm install
npm run build
pm2 restart synapsify-web
```

## Troubleshooting

### Port 3000 already in use
```bash
# Find what's using port 3000
lsof -i :3000
# Kill the process or change the port in package.json
```

### Nginx 502 Bad Gateway
- Check if Next.js is running: `pm2 status`
- Check Next.js logs: `pm2 logs synapsify-web`
- Verify nginx proxy_pass URL matches your app port

### Cannot connect to GitHub
- Verify PAT is correct
- Check if firewall allows outbound HTTPS (port 443)
- Try cloning with: `git clone https://hdolivares:YOUR_PAT@github.com/hdolivares/Synapsify-Web.git`

## Quick Deployment Script

You can also use the provided `deploy.sh` script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Make sure to update the paths in the script to match your server setup.


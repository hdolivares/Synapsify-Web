#!/bin/bash

# Quick Setup Script for Synapsify-Web Server
# Run this on your server after SSH'ing in

echo "🚀 Synapsify-Web Server Setup"
echo "================================"

# Step 1: Configure Git
echo ""
echo "📝 Step 1: Configuring Git..."
git config --global user.name "hdolivares"
git config --global user.email "hobeja7@gmail.com"

# Step 2: Clone Repository
echo ""
echo "📥 Step 2: Cloning repository..."
if [ -d "Synapsify-Web" ]; then
    echo "Repository already exists. Pulling latest changes..."
    cd Synapsify-Web
    git pull
else
    # Clone using PAT - Replace YOUR_GITHUB_PAT with your actual token
    git clone https://YOUR_GITHUB_PAT@github.com/hdolivares/Synapsify-Web.git
    cd Synapsify-Web
fi

# Step 3: Install Node.js if needed
echo ""
echo "📦 Step 3: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

# Step 4: Install PM2 if needed
echo ""
echo "📦 Step 4: Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "PM2 already installed"
fi

# Step 5: Install nginx if needed
echo ""
echo "📦 Step 5: Checking nginx..."
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    apt-get update
    apt-get install -y nginx
else
    echo "nginx already installed"
fi

# Step 6: Install project dependencies
echo ""
echo "📦 Step 6: Installing project dependencies..."
npm install

# Step 7: Build project
echo ""
echo "🔨 Step 7: Building project..."
npm run build

# Step 8: Setup PM2
echo ""
echo "🚀 Step 8: Setting up PM2..."
pm2 delete synapsify-web 2>/dev/null || true
pm2 start npm --name "synapsify-web" -- start
pm2 save

# Step 9: Setup nginx
echo ""
echo "⚙️  Step 9: Configuring nginx..."
cp nginx-config.conf /etc/nginx/sites-available/synapsify-web
ln -sf /etc/nginx/sites-available/synapsify-web /etc/nginx/sites-enabled/synapsify-web
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
if nginx -t; then
    systemctl reload nginx
    echo "✅ nginx configured successfully"
else
    echo "⚠️  nginx configuration has errors. Please check manually."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /etc/nginx/sites-available/synapsify-web and update 'server_name' with your domain"
echo "2. Run: nginx -t && systemctl reload nginx"
echo "3. Set up SSL: certbot --nginx -d yourdomain.com"
echo "4. Check status: pm2 status"
echo "5. View logs: pm2 logs synapsify-web"


#!/bin/bash

# Synapsify-Web Deployment Script
# Run this script on your server after cloning the repository

set -e

echo "🚀 Starting Synapsify-Web deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    apt-get update
    apt-get install -y nginx
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name "synapsify-web" -- start
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "📝 Next steps:"
echo "1. Configure nginx (see nginx-config.conf)"
echo "2. Set up SSL with Let's Encrypt (optional)"
echo "3. Point your domain to this server's IP"


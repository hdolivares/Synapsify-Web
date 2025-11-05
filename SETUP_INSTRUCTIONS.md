# Setup Instructions for Synapsify-Web Server Deployment
# Follow these steps in order

## Step 1: Accept Host Key (First Time Only)

Before running any commands, you need to accept the server's host key. Do this once:

**Option A: Using Bitvise GUI**
1. Open Bitvise SSH Client
2. Load the `synapsify.tlp` profile
3. Click "Log in"
4. When prompted about the host key, click "Accept and Save"
5. You can now close Bitvise GUI

**Option B: Using Interactive Terminal**
```powershell
cd C:\Synapsify-Web
& "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe" -profile=".\synapsify.tlp"
# When prompted, type 'S' to accept and save the host key
# Then type 'exit' to close
```

## Step 2: Run Automated Setup

Once the host key is accepted, run the setup script:

```powershell
cd C:\Synapsify-Web
.\server-setup-bitvise.ps1 -GitHubPAT "YOUR_GITHUB_PAT_HERE"
# Replace YOUR_GITHUB_PAT_HERE with your actual GitHub Personal Access Token
```

## Step 3: Manual Steps After Setup

After the script completes:

1. **Edit nginx configuration:**
   ```powershell
   # Upload your domain-specific nginx config or edit on server
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nano /etc/nginx/sites-available/synapsify-web"
   # Update 'server_name' with your actual domain
   # Save (Ctrl+X, Y, Enter)
   ```

2. **Reload nginx:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="nginx -t && systemctl reload nginx"
   ```

3. **Set up SSL (Optional):**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="apt-get install -y certbot python3-certbot-nginx"
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="certbot --nginx -d yourdomain.com -d www.yourdomain.com"
   ```

## Step 4: Verify Deployment

```powershell
# Check PM2 status
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 status"

# Check if app is running
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="curl http://localhost:3000"

# View logs
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="pm2 logs synapsify-web --lines 50"
```

## Troubleshooting

If you get "host key rejected" errors:
- Use Bitvise GUI to accept the host key first (see Step 1)
- Or manually accept using stermc interactive terminal

If setup fails at any step:
- Check the error output
- Run individual commands manually using sexec
- Refer to BITVISE_WORKFLOW.md for detailed commands


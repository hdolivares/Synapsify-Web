# CyberPanel Installation Alternatives

Since the automated installation via `sexec` is closing connections, here are alternative methods:

## Method 1: Interactive Terminal (Recommended)

Use Bitvise's interactive terminal (`stermc`) which is designed for interactive sessions:

```powershell
# Run the interactive installation script
.\install-cyberpanel-interactive.ps1
```

This will:
1. Open an interactive terminal window
2. You manually enter the installation options when prompted
3. Installation runs in the terminal window (connection won't drop)

**Installation Options to Enter:**
- Option 1: Install CyberPanel with OpenLiteSpeed
- Option 1: Full installation
- Password: `CyberPanel@2025`
- Email: `hobeja7@gmail.com`

## Method 2: Screen Session with Improved Expect Script

This method uses a better expect script in a screen session:

```powershell
# Run the screen-based installation
.\install-cyberpanel-screen.ps1
```

This will:
1. Create an improved expect script with better timeout handling
2. Start installation in a screen session
3. Session persists even if connection drops
4. Monitor with: `.\monitor-cyberpanel-install.ps1`

## Method 3: Manual Installation via Interactive Terminal

If automated methods fail, use Bitvise's interactive terminal directly:

```powershell
# Open interactive terminal
& "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe" -profile=".\synapsify.tlp"

# Then in the terminal, run:
cd /tmp
curl -o cyberpanel-install.sh https://cyberpanel.net/install.sh
chmod +x cyberpanel-install.sh
bash cyberpanel-install.sh

# Follow the prompts:
# 1. Enter: 1 (OpenLiteSpeed)
# 2. Enter: 1 (Full installation)
# 3. Enter: CyberPanel@2025 (password)
# 4. Enter: hobeja7@gmail.com (email)
```

## Method 4: Alternative Control Panel

If CyberPanel continues to have issues, consider these alternatives:

### RunCloud
- SaaS-based control panel
- Good for PHP applications
- Easy WordPress management
- Visit: https://runcloud.io

### ServerPilot
- Cloud control panel
- WordPress-focused
- Simple setup
- Visit: https://serverpilot.io

### HestiaCP
- Open-source control panel
- Similar to CyberPanel
- Lightweight
- Installation: `curl -o hestia-install.sh https://raw.githubusercontent.com/hestiacp/hestiacp/release/install/hcp-install.sh && bash hestia-install.sh`

## Monitoring Installation

### Check Status
```powershell
# Quick status check
.\check-cyberpanel-status.ps1

# Detailed monitoring
.\monitor-cyberpanel-install.ps1
```

### Attach to Screen Session
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe" -profile=".\synapsify.tlp" -cmd="screen -r cyberpanel-install"
```

### Check Installation Logs
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="tail -50 /tmp/cyberpanel-install.log"
```

## Troubleshooting

### Connection Drops During Installation

**Solution 1:** Use `stermc` (interactive terminal) instead of `sexec`
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\stermc.exe" -profile=".\synapsify.tlp"
```

**Solution 2:** Use screen/tmux to persist sessions
```bash
screen -S install
# Run installation
# Detach with: Ctrl+A, then D
# Reattach with: screen -r install
```

**Solution 3:** Use nohup
```bash
nohup bash /tmp/cyberpanel-install.sh > /tmp/install.log 2>&1 &
```

### Installation Fails

1. Check system requirements:
   ```bash
   cat /etc/*release
   # CyberPanel supports: Ubuntu 18.04/20.04/22.04/24.04, AlmaLinux 8/9, CloudLinux 7
   ```

2. Check disk space:
   ```bash
   df -h
   # Need at least 2GB free space
   ```

3. Check internet connection:
   ```bash
   ping -c 3 cyberpanel.net
   ```

4. Review logs:
   ```bash
   tail -100 /var/log/cyberpanel-install.log
   ```

## Recommended Approach

**For your situation, I recommend Method 1 (Interactive Terminal):**

1. Run `.\install-cyberpanel-interactive.ps1`
2. Follow the prompts in the terminal window
3. Installation will complete without connection drops
4. Monitor with `.\check-cyberpanel-status.ps1`

This method is most reliable because:
- Uses Bitvise's interactive terminal (`stermc`) designed for long-running sessions
- You can see real-time progress
- Connection won't timeout
- You can respond to prompts directly

## Post-Installation

Once CyberPanel is installed:

1. **Access CyberPanel:**
   - URL: `https://104.237.6.152:8090`
   - Username: `admin`
   - Password: `CyberPanel@2025`

2. **Change Password Immediately:**
   - Login → User → Change Password

3. **Configure Firewall:**
   ```powershell
   & "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" -profile=".\synapsify.tlp" -cmd="ufw allow 8090/tcp && ufw allow 7080/tcp && ufw allow 80/tcp && ufw allow 443/tcp"
   ```

4. **Set Up Domain:**
   - In CyberPanel: Websites → Create Website
   - Domain: `synapsify.app`
   - This will configure OpenLiteSpeed to serve your domain


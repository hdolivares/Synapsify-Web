# Improved Git-Based Deployment Workflow

This document describes the improved deployment workflow for Synapsify-Web that enforces proper version control practices.

## ✅ Setup Complete

The server has been configured with your GitHub Personal Access Token (PAT), enabling seamless git operations.

## 🚀 New Workflow

### 1. Make Local Changes
Edit files locally in your IDE as usual.

### 2. Deploy to Server
Run the automated deployment script:

```powershell
.\deploy-from-local.ps1
```

This script will:
1. ✓ Check for uncommitted changes
2. ✓ Prompt you to commit if needed
3. ✓ Push to GitHub
4. ✓ Pull changes on the server
5. ✓ Install dependencies and build
6. ✓ Restart PM2

### 3. Monitor Deployment

Check server status:
```powershell
.\check-status.ps1
```

View application logs:
```powershell
.\view-logs.ps1           # View last 50 lines
.\view-logs.ps1 -Lines 100  # View last 100 lines
.\view-logs.ps1 -Follow     # Follow logs in real-time
.\view-logs.ps1 -ErrorOnly  # View errors only
```

## 📝 Manual Deployment Steps

If you prefer to run steps manually:

### Step 1: Commit and Push
```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

### Step 2: Pull and Deploy on Server
```powershell
& "C:\Program Files (x86)\Bitvise SSH Client\sexec.exe" `
    -profile="C:\Synapsify-Web\synapsify.tlp" `
    -cmd="cd /root/Synapsify-Web && git pull && npm install && npm run build && pm2 restart synapsify-web"
```

## 🔧 Utility Scripts

### Quick Status Check
```powershell
.\check-status.ps1
```
Shows:
- PM2 process status
- Application health (HTTP response)
- Nginx status

### View Logs
```powershell
# View last 50 lines
.\view-logs.ps1

# View last 100 lines with follow mode
.\view-logs.ps1 -Lines 100 -Follow

# View errors only
.\view-logs.ps1 -ErrorOnly
```

### Old Deployment Scripts (Still Available)
- `.\deploy-now.ps1` - Direct file upload (bypasses git)
- `.\clean-deploy.ps1` - Clean build deployment
- `.\force-clean.ps1` - Force clean and rebuild
- `.\rebuild-restart.ps1` - Rebuild and restart

## ⚡ Benefits of This Workflow

1. **Version Control**: Every deployment is tracked in git history
2. **Rollback Capability**: Easy to revert to previous versions
3. **Team Collaboration**: Multiple developers can work without conflicts
4. **Audit Trail**: Clear history of what was deployed and when
5. **Best Practices**: Enforces committing before deploying

## 🔐 Security

The GitHub PAT is stored directly in the git remote URL on the server:
```
https://ghp_XXXXX@github.com/hdolivares/Synapsify-Web.git
```

This allows the server to authenticate with GitHub for pull operations.

⚠️ **Important**: Never commit the PAT to the repository. It's only stored in the server's git config.

## 🐛 Troubleshooting

### "Failed to push to GitHub"
- Check your internet connection
- Verify you have push access to the repository
- Ensure you've committed your changes

### "Failed to pull on server"
- The PAT may have expired
- Check server connectivity
- Verify the repository URL on the server

### "Build failed"
- Check logs: `.\view-logs.ps1 -ErrorOnly`
- Verify there are no TypeScript errors locally
- Ensure all dependencies are in `package.json`

### "PM2 restart issues"
- Check PM2 status: `.\check-status.ps1`
- View PM2 logs: `.\view-logs.ps1`
- Try manual restart via Bitvise

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Deploy from local | `.\deploy-from-local.ps1` |
| Check status | `.\check-status.ps1` |
| View logs | `.\view-logs.ps1` |
| Follow logs | `.\view-logs.ps1 -Follow` |
| View errors only | `.\view-logs.ps1 -ErrorOnly` |

## 🎯 Best Practices

1. **Always commit before deploying** - The script enforces this
2. **Write meaningful commit messages** - Helps track changes
3. **Test locally first** - Run `npm run build` before deploying
4. **Monitor logs after deployment** - Ensure no runtime errors
5. **Use branches for experiments** - Keep main branch stable

---

**Happy Deploying! 🚀**

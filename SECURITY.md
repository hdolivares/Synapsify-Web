# Security Notice: Credentials Management

## ⚠️ IMPORTANT: Never Commit Credentials

This repository should **NEVER** contain:
- Passwords
- API keys
- Personal Access Tokens (PATs)
- SSH keys
- Bitvise profile files (*.tlp)
- Environment files with secrets (.env, .env.local, etc.)

## Secure Practices

1. **Bitvise Profile Files**: Keep `synapsify.tlp` locally only. It's in `.gitignore` and should never be committed.

2. **GitHub PAT**: Store your GitHub Personal Access Token:
   - As a PowerShell environment variable
   - In a local `.env` file (not committed)
   - Pass it as a script parameter when needed

3. **Server Credentials**: Store server passwords:
   - In Bitvise profile (local only)
   - In password manager
   - Never in documentation or code

4. **Documentation**: All documentation files use placeholders:
   - `YOUR_GITHUB_PAT_HERE` - Replace with your actual PAT
   - `yourdomain.com` - Replace with your actual domain
   - No real passwords or credentials

## If Credentials Are Exposed

If you accidentally commit credentials:

1. **Immediately revoke/change them**:
   - GitHub: Revoke the PAT in Settings → Developer settings → Personal access tokens
   - Server: Change the password

2. **Remove from git history** (if needed):
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # This rewrites history - coordinate with team first
   ```

3. **Update .gitignore** to prevent future commits

4. **Scan repository** using tools like GitGuardian or GitHub's secret scanning

## Current Status

✅ `.gitignore` includes patterns for secrets  
✅ `synapsify.tlp` removed from tracking  
✅ Documentation uses placeholders  
✅ No hardcoded credentials in current files


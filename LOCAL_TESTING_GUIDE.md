# Local Testing Guide

## ⚠️ IMPORTANT: Always Test Locally Before Deployment

This guide ensures we catch errors **before** deploying to the VPS.

## Quick Test Commands

### Option 1: Automated Test Script (Recommended)
```powershell
.\test-local-build.ps1
```
This script will:
1. Clean previous builds
2. Build the project
3. Start production server
4. Guide you through browser testing

### Option 2: Manual Testing

#### Step 1: Build the Project
```powershell
npm run build
```

**Check for:**
- ✅ Build succeeds without errors
- ⚠️ Note any warnings (they may indicate issues)

#### Step 2: Start Production Server
```powershell
npm start
```
Server runs on **port 3001** (not 3000)

#### Step 3: Test in Browser
1. Open **http://localhost:3001** in your browser
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Check for:
   - ❌ React Error #482 (Hydration Mismatch)
   - ❌ "Application error: a client-side exception has occurred"
   - ❌ Any red error messages
   - ⚠️ Yellow warnings (less critical but note them)

#### Step 4: Test in Cursor's Built-in Browser
1. Use Cursor's browser tools to navigate to `http://localhost:3001`
2. Check console messages using browser tools
3. Verify page renders correctly

## What to Look For

### ✅ Good Signs
- Page loads without errors
- No React hydration errors in console
- All components render correctly
- No "Application error" messages

### ❌ Bad Signs (Fix Before Deploying)
- **React Error #482** - Hydration mismatch (server/client HTML differs)
- **"Application error"** - Client-side exception occurred
- **Infinite error loops** - Component re-rendering errors
- **Blank page** - Critical rendering failure

## Common Issues & Fixes

### Issue: React Error #482 (Hydration Mismatch)
**Causes:**
- Using `new Date()` or `Date.now()` in server components
- Browser APIs (`window`, `document`) in initial render
- Random values (`Math.random()`) in initial render
- Conditional rendering based on client-only state

**Fixes Applied:**
- ✅ Date rendering: Changed to static year
- ✅ CustomCursor: Added `mounted` check
- ✅ ScrollProgress: Added `mounted` check
- ✅ Preloader: Added `mounted` check

### Issue: Browser Extension Errors
**Symptom:** "Unchecked runtime.lastError: The message port closed"
**Solution:** Test in incognito mode to rule out extensions

### Issue: Favicon 404
**Symptom:** `GET /favicon.ico 404`
**Solution:** Add `favicon.ico` to `/public` directory (non-critical)

## Testing Checklist

Before deploying, verify:
- [ ] Build succeeds: `npm run build`
- [ ] Production server starts: `npm start`
- [ ] Page loads at http://localhost:3001
- [ ] No console errors (check DevTools)
- [ ] No React hydration errors
- [ ] All components render correctly
- [ ] Interactive elements work (buttons, links)
- [ ] Animations work smoothly
- [ ] Page is responsive (test different screen sizes)

## Development vs Production Testing

### Development Mode (`npm run dev`)
- Runs on port **3020**
- Shows detailed error messages
- Hot reload enabled
- **Use for:** Development and debugging

### Production Mode (`npm start`)
- Runs on port **3001**
- Minified code (harder to debug)
- Production optimizations
- **Use for:** Pre-deployment testing (matches VPS environment)

## Why Test in Production Mode?

The VPS runs in **production mode**, so:
- Errors may only appear in production builds
- Minified code can hide issues
- Production optimizations can cause different behavior
- **Always test production build before deploying**

## Next Steps After Local Testing

1. ✅ If all tests pass → Deploy to VPS
2. ❌ If errors found → Fix locally, test again, then deploy
3. ⚠️ If warnings found → Evaluate if critical, fix if needed

## Remember

**"If it works locally, it should work on the VPS"** - but only if you test the **production build** locally first!


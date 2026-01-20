# Fix CORS Issue - Quick Guide

## The Problem
Your local frontend (`http://localhost:5173`) can't access your deployed backend (`https://photoshare-six.vercel.app`) because the backend doesn't have the localhost origin in its ALLOWED_ORIGINS environment variable.

## Solution: Add ALLOWED_ORIGINS to Vercel

### Method 1: Vercel Dashboard (Easiest) ✅

1. Go to: https://vercel.com/dashboard
2. Click on your backend project (`photoshare-six`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: `http://localhost:5173,https://your-deployed-frontend.vercel.app`
6. Select: **Production**, **Preview**, and **Development**
7. Click **Save**
8. Go to **Deployments** tab
9. Click the three dots on latest deployment → **Redeploy**

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to backend
cd backend

# Login to Vercel
vercel login

# Add environment variable
vercel env add ALLOWED_ORIGINS

# When prompted, enter:
# Value: http://localhost:5173,https://your-deployed-frontend.vercel.app
# Environment: Production (and optionally Preview, Development)

# Redeploy
vercel --prod
```

## Important Notes

1. **No spaces in the value!** 
   - ✅ Correct: `http://localhost:5173,https://example.com`
   - ❌ Wrong: `http://localhost:5173, https://example.com`

2. **Include all origins you need:**
   - Local development: `http://localhost:5173`
   - Deployed frontend: `https://your-frontend.vercel.app`
   - Separate with commas, no spaces

3. **You must redeploy** after adding environment variables!

## Verify It Works

After redeploying:

1. Open your local frontend: http://localhost:5173
2. Open browser console (F12)
3. Try the action that was failing
4. The CORS error should be gone! ✅

## If Still Not Working

Check these:

1. **Spelling**: Make sure the variable name is exactly `ALLOWED_ORIGINS`
2. **Value format**: No spaces, comma-separated
3. **Redeployed**: Environment variables only apply after redeployment
4. **Clear cache**: Hard refresh your browser (Ctrl+Shift+R)

## Current Configuration Needed

Based on your setup:

```
ALLOWED_ORIGINS=http://localhost:5173,https://your-deployed-frontend.vercel.app
```

Replace `https://your-deployed-frontend.vercel.app` with your actual deployed frontend URL when you deploy it.

For now, if you're only testing locally, you can use:

```
ALLOWED_ORIGINS=http://localhost:5173
```

---

**After following these steps, your local frontend will be able to communicate with your deployed backend! 🎉**

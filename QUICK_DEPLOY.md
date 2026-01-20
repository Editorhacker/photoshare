# Quick Vercel Deployment Commands

## Install Vercel CLI
```bash
npm install -g vercel
```

## Login to Vercel
```bash
vercel login
```

---

## Backend Deployment

```bash
# Navigate to backend folder
cd backend

# Initial deployment
vercel

# Set environment variables (run each command separately)
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_PRIVATE_KEY
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add GOOGLE_DRIVE_CLIENT_ID
vercel env add GOOGLE_DRIVE_CLIENT_SECRET
vercel env add JWT_SECRET
vercel env add ALLOWED_ORIGINS

# Deploy to production
vercel --prod
```

**Copy the backend production URL** (e.g., `https://photoshare-backend.vercel.app`)

---

## Frontend Deployment

```bash
# Navigate to frontend folder
cd ../frontend

# Initial deployment
vercel

# Set environment variables (run each command separately)
# Replace YOUR_BACKEND_URL with the URL from backend deployment
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-url.vercel.app (no trailing slash)

vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID

# Deploy to production
vercel --prod
```

---

## Important Notes

1. **ALLOWED_ORIGINS**: Enter as comma-separated values without spaces:
   ```
   http://localhost:5173,https://your-frontend-url.vercel.app
   ```

2. **FIREBASE_PRIVATE_KEY**: Paste the entire key including line breaks as-is

3. **VITE_API_BASE_URL**: No trailing slash!
   - ✅ Correct: `https://photoshare-backend.vercel.app`
   - ❌ Wrong: `https://photoshare-backend.vercel.app/`

4. After deploying frontend, update backend's `ALLOWED_ORIGINS` with the frontend URL:
   ```bash
   cd backend
   vercel env add ALLOWED_ORIGINS
   # Enter: http://localhost:5173,https://your-deployed-frontend.vercel.app
   vercel --prod
   ```

---

## Redeploy

To redeploy after making changes:

```bash
# In backend or frontend folder
vercel --prod
```

---

## View Logs

```bash
vercel logs [deployment-url]
```

---

## List Projects

```bash
vercel ls
```

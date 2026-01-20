# PhotoShare - Vercel Deployment Guide

This guide will help you deploy the PhotoShare project to Vercel with separate deployments for the backend and frontend.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed globally: `npm install -g vercel`
3. Your Firebase and Google Drive credentials ready

## Part 1: Deploy Backend to Vercel

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Login to Vercel (if not already logged in)
```bash
vercel login
```

### Step 3: Deploy Backend
```bash
vercel
```

During the setup, answer the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → `photoshare-backend` (or your preferred name)
- **In which directory is your code located?** → `./`

### Step 4: Set Environment Variables

After the initial deployment, set your environment variables:

```bash
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_PRIVATE_KEY
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add GOOGLE_DRIVE_CLIENT_ID
vercel env add GOOGLE_DRIVE_CLIENT_SECRET
vercel env add JWT_SECRET
```

For each variable, when prompted:
- Select **Production** environment
- Enter the value
- Also add to **Preview** and **Development** if needed

**Important for FIREBASE_PRIVATE_KEY:**
The private key contains newlines. When entering it in Vercel, make sure to preserve the exact format including `\n` characters.

### Step 5: Deploy to Production
```bash
vercel --prod
```

✅ **Your backend is now deployed!** Copy the production URL (e.g., `https://photoshare-backend.vercel.app`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

### Step 2: Deploy Frontend
```bash
vercel
```

During the setup:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → `photoshare-frontend` (or your preferred name)
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → No (or configure if needed)

### Step 3: Set Environment Variables

Set the backend URL and Firebase configuration:

```bash
vercel env add VITE_API_BASE_URL
# Enter your backend URL from Part 1, e.g., https://photoshare-backend.vercel.app

vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

✅ **Your frontend is now deployed!**

---

## Alternative: Deploy via Vercel Dashboard

If you prefer using the Vercel dashboard:

### Backend Deployment:
1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the `backend` folder as the root directory
4. Add environment variables in Project Settings → Environment Variables
5. Deploy

### Frontend Deployment:
1. Go to https://vercel.com/new (in a new project)
2. Import the same Git repository
3. Select the `frontend` folder as the root directory
4. Set **Framework Preset** to "Vite"
5. Add environment variables in Project Settings → Environment Variables
6. Deploy

---

## Important Post-Deployment Steps

### 1. Update Frontend API URL
Make sure the `VITE_API_BASE_URL` in your frontend environment variables points to your deployed backend URL.

### 2. Update CORS Settings
In your `backend/src/app.js`, update CORS to allow your frontend domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://your-frontend-url.vercel.app' // Production
  ],
  credentials: true
}));
```

### 3. Firebase Storage CORS
Ensure your Firebase Storage bucket has proper CORS configuration to allow requests from your frontend domain.

---

## Testing Your Deployment

1. Visit your frontend URL
2. Test user authentication
3. Test image upload and gallery features
4. Check browser console for any errors

---

## Troubleshooting

### Backend Issues:
- Check Vercel Function Logs in the dashboard
- Ensure all environment variables are set correctly
- Verify Firebase credentials are valid

### Frontend Issues:
- Check that `VITE_API_BASE_URL` is correctly set
- Ensure the API URL doesn't have a trailing slash
- Clear browser cache if changes aren't appearing

### CORS Errors:
- Update backend CORS configuration with frontend URL
- Redeploy backend after CORS changes

---

## Useful Commands

```bash
# View deployment logs
vercel logs [deployment-url]

# List all environment variables
vercel env ls

# Remove a deployment
vercel rm [deployment-name]

# View project settings
vercel project

# Redeploy without changes
vercel --prod
```

---

## Continuous Deployment

To enable automatic deployments when you push to Git:

1. Connect your Git repository to Vercel in the dashboard
2. Vercel will automatically deploy on every push to main/master
3. Pull requests will get preview deployments

---

## Cost Considerations

- Vercel Free Tier includes:
  - 100GB bandwidth per month
  - Serverless function execution
  - Automatic HTTPS
  - Preview deployments

- Monitor your usage in the Vercel dashboard

---

## Support

If you encounter issues:
- Check Vercel documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Community forums: https://github.com/vercel/vercel/discussions

---

**Happy Deploying! 🚀**

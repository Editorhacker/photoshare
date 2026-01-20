# PhotoShare - Vercel Deployment Setup ✅

Your PhotoShare project is now ready for deployment to Vercel with separate backend and frontend deployments!

## 📁 Project Structure

```
photoshare/
├── backend/                    # Express.js API
│   ├── vercel.json            # ✅ Vercel backend config
│   ├── .env.example           # ✅ Environment variables template
│   └── package.json           # ✅ Updated with start script
│
├── frontend/                   # React + Vite app
│   ├── vercel.json            # ✅ Vercel frontend config
│   ├── .env.example           # ✅ Environment variables template
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md        # 📖 Comprehensive deployment guide
├── QUICK_DEPLOY.md            # ⚡ Quick command reference
└── README.md                  # This file
```

## 🚀 Quick Start

### Option 1: Use Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Follow the Quick Deploy Guide**
   - Open `QUICK_DEPLOY.md` for step-by-step commands
   - Deploy backend first, then frontend
   - Set environment variables for each

### Option 2: Use Vercel Dashboard

1. **Import your Git repository** to Vercel
2. **Create two separate projects:**
   - One for `backend` folder
   - One for `frontend` folder
3. **Configure environment variables** in each project
4. **Deploy!**

## 📋 Deployment Checklist

### Before Deployment:

- [ ] Have Firebase credentials ready
- [ ] Have Google Drive API credentials ready
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Review `.env.example` files

### Backend Deployment:

- [ ] Deploy backend to Vercel
- [ ] Set all environment variables (7 total)
- [ ] Copy the backend production URL

### Frontend Deployment:

- [ ] Deploy frontend to Vercel
- [ ] Set VITE_API_BASE_URL to backend URL
- [ ] Set Firebase client configuration (6 variables)
- [ ] Test the deployed application

### Post-Deployment:

- [ ] Update backend ALLOWED_ORIGINS with frontend URL
- [ ] Redeploy backend
- [ ] Test authentication
- [ ] Test image upload
- [ ] Test gallery features

## 🔧 What Changed

### Backend (`backend/`)

1. **`vercel.json`** - Added Vercel serverless configuration
2. **`package.json`** - Added `start` script for Vercel
3. **`src/app.js`** - Updated CORS to use environment variable
4. **`.env.example`** - Added ALLOWED_ORIGINS variable

### Frontend (`frontend/`)

1. **`vercel.json`** - Added SPA routing configuration
2. **`.env.example`** - Template for environment variables

## 🌐 Environment Variables

### Backend (7 variables)
```
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
GOOGLE_DRIVE_CLIENT_ID
GOOGLE_DRIVE_CLIENT_SECRET
JWT_SECRET
ALLOWED_ORIGINS
```

### Frontend (7 variables)
```
VITE_API_BASE_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## 📚 Documentation

- **`DEPLOYMENT_GUIDE.md`** - Complete deployment walkthrough with troubleshooting
- **`QUICK_DEPLOY.md`** - Quick command reference for CLI deployment
- **Backend `.env.example`** - Backend environment variables template
- **Frontend `.env.example`** - Frontend environment variables template

## ⚠️ Important Notes

1. **Deploy Backend First** - You need the backend URL for frontend configuration

2. **CORS Configuration** - After deploying frontend, update backend's `ALLOWED_ORIGINS`:
   ```
   http://localhost:5173,https://your-frontend.vercel.app
   ```

3. **No Trailing Slashes** - API URLs should not end with `/`

4. **Firebase Private Key** - Include the entire key with line breaks

## 🆘 Need Help?

- See `DEPLOYMENT_GUIDE.md` for detailed instructions
- Check the troubleshooting section in the deployment guide
- Vercel documentation: https://vercel.com/docs

## 🎉 Next Steps

1. Open `QUICK_DEPLOY.md` for deployment commands
2. Follow the backend deployment steps
3. Then follow the frontend deployment steps
4. Test your deployed application!

---

**Ready to deploy? Open `QUICK_DEPLOY.md` and let's go! 🚀**

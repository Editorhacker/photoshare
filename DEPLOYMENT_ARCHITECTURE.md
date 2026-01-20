# PhotoShare Deployment Architecture

## Current Architecture (After Deployment)

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌───────────────┐                  ┌──────────────┐
│   Frontend    │                  │   Firebase   │
│   (Vercel)    │                  │   Storage    │
│               │                  │              │
│ React + Vite  │                  │ Image Files  │
└───────┬───────┘                  └──────────────┘
        │
        │ API Calls
        │ HTTPS
        │
        ▼
┌───────────────────┐
│     Backend       │
│     (Vercel)      │
│                   │
│  Express.js API   │
│  Serverless       │
└────────┬──────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Firebase   │   │ Google Drive │   │   Firebase   │
│     Auth     │   │     API      │   │   Storage    │
│              │   │              │   │              │
│ User Auth    │   │ Drive Upload │   │ Public URLs  │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Deployment Flow

### Step 1: Backend Deployment
```
Local Backend → Vercel CLI → Vercel Serverless Functions
                           → Backend URL Generated
                           → https://photoshare-backend.vercel.app
```

### Step 2: Frontend Deployment
```
Local Frontend → Vercel CLI → Vercel Edge Network
                            → Frontend URL Generated
                            → https://photoshare-frontend.vercel.app
                            → Uses Backend URL for API calls
```

## Environment Variables Flow

### Backend Environment Variables
```
Local .env → Vercel Environment Variables → Backend Functions

Variables:
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL
- GOOGLE_DRIVE_CLIENT_ID
- GOOGLE_DRIVE_CLIENT_SECRET
- JWT_SECRET
- ALLOWED_ORIGINS (includes frontend URL)
```

### Frontend Environment Variables
```
Local .env → Vercel Environment Variables → Build Process

Variables:
- VITE_API_BASE_URL (points to backend URL)
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
```

## Request Flow Example

### Upload Image Flow:
```
1. User selects image in browser
   ↓
2. Frontend sends to Backend API
   https://photoshare-backend.vercel.app/api/upload
   ↓
3. Backend processes image (using Sharp)
   ↓
4. Backend uploads to Firebase Storage
   ↓
5. Backend saves metadata to Firebase
   ↓
6. Backend returns public URL to Frontend
   ↓
7. Frontend displays image
```

### View Gallery Flow:
```
1. User opens gallery page
   ↓
2. Frontend requests images from Backend
   https://photoshare-backend.vercel.app/api/images
   ↓
3. Backend queries Firebase
   ↓
4. Backend returns image URLs
   ↓
5. Frontend loads images from Firebase Storage
   (Direct URLs, bypassing backend)
```

## Two Separate Deployments

### Why Separate?
- ✅ Independent scaling
- ✅ Better performance (CDN for frontend)
- ✅ Easier to manage and update
- ✅ Backend can be used by multiple frontends
- ✅ Clear separation of concerns

### Backend (API)
- **URL Pattern**: `https://photoshare-backend.vercel.app/api/*`
- **Purpose**: Handle business logic, auth, file processing
- **Technology**: Express.js running as serverless functions
- **Scaling**: Automatic via Vercel

### Frontend (Client)
- **URL Pattern**: `https://photoshare-frontend.vercel.app/*`
- **Purpose**: User interface and client-side logic
- **Technology**: React + Vite (static site)
- **Scaling**: Served via Vercel Edge Network (CDN)

## CORS Configuration

```
Backend: ALLOWED_ORIGINS environment variable
         ↓
         Allows: http://localhost:5173 (dev)
                 https://photoshare-frontend.vercel.app (prod)
         ↓
         Frontend can make API calls to Backend
```

## Continuous Deployment (Optional)

```
Git Repository (GitHub/GitLab/Bitbucket)
  │
  ├─ Push to main branch
  │
  ├─→ Vercel detects change
  │
  ├─→ Auto-deploy Backend
  │   └─→ https://photoshare-backend.vercel.app
  │
  └─→ Auto-deploy Frontend
      └─→ https://photoshare-frontend.vercel.app
```

## Security Notes

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Only allow specific origins (your frontend URL)
3. **API Keys**: Stored securely in Vercel environment variables
4. **HTTPS**: All communication is encrypted (Vercel provides free SSL)
5. **Firebase Rules**: Set up proper security rules for Storage and Auth

## Performance Optimization

- Frontend: Static files served from CDN
- Backend: Serverless functions scale automatically
- Images: Served directly from Firebase Storage CDN
- Caching: Vercel handles caching automatically

## Monitoring

- **Vercel Dashboard**: View deployment logs and analytics
- **Backend Logs**: `vercel logs [backend-url]`
- **Frontend Logs**: Browser console
- **Firebase Console**: Monitor storage and auth usage

---

**This architecture provides a scalable, secure, and performant deployment for your PhotoShare application! 🚀**

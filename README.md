# 📸 PhotoShare – Secure Photo Sharing for Photographers

PhotoShare is a full-stack web application that allows photographers to upload client photos to Google Drive, compress them, and share **view-only public galleries** with clients — without exposing Google Drive links or allowing direct downloads.

---

## 🚀 Features

### 👤 Photographer
- Signup & Login (Firebase Authentication)
- Email verification required
- Connect personal Google Drive (OAuth 2.0)
- Create albums backed by Google Drive folders
- Upload & compress images
- Secure dashboard gallery
- Generate public share links

### 👥 Client
- Open public share link (no login)
- View images only
- No Google Drive links exposed
- Download prevention (server streaming)

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- JSX
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- Firebase Admin SDK
- Firestore
- Google Drive API
- Sharp (image compression)
- Multer (file upload)

### Storage
- Google Drive (folder-only model)
- Firestore (metadata & album references)

---

## 📂 Project Structure

### Backend
├── src/
│ ├── app.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── drive.routes.js
│ │ ├── album.routes.js
│ │ └── public.routes.js
│ ├── controllers/
│ ├── services/
│ │ └── drive.service.js
│ ├── middleware/
│ └── config/
├── server.js
└── serviceAccountKey.json


### Frontend
photoshare-frontend/
├── src/
│ ├── App.jsx
│ ├── main.jsx
│ ├── api.js
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Gallery.jsx
│ │ └── Share.jsx
│ └── components/
│ └── PhotoGrid.jsx
└── package.json

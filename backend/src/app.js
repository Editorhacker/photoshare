
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../routes/auth.routes")
const driveRoutes = require("../routes/drive.routes")
const albumRoutes = require("../routes/album.routes")
const publicRoutes = require("../routes/public.routes")

const app = express();

// CORS configuration - supports both local and production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/public", publicRoutes);


module.exports = app;
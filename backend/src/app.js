
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../routes/auth.routes")
const driveRoutes = require("../routes/drive.routes")
const albumRoutes = require("../routes/album.routes")
const publicRoutes = require("../routes/public.routes")

const app = express();
app.use(cors("*"));
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/album",albumRoutes);
app.use("/api/public", publicRoutes);


module.exports = app;
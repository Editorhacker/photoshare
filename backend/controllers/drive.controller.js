const { oauth2Client, SCOPES } = require("../config/googleDrive");
const { db } = require("../config/firebase");
const { google } = require("googleapis");
const stream = require("stream");   // 🔥 IMPORTANT
const { v4: uuidv4 } = require('uuid');


/* ----------------------------------------------------
  1) CONNECT GOOGLE DRIVE
---------------------------------------------------- */
exports.connectDrive = async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
      state: req.user.uid,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ----------------------------------------------------
  2) GOOGLE DRIVE CALLBACK
---------------------------------------------------- */
exports.driveCallback = async (req, res) => {
  try {
    const { code, state: uid } = req.query;

    if (!code || !uid) {
      return res.status(400).json({ error: "Missing code or user id" });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // ✅ SAFE: creates doc if missing, updates if exists
    await db.collection("photographers").doc(uid).set(
      {
        googleDriveConnected: true,
        driveTokens: tokens,
        driveConnectedAt: new Date(),
      },
      { merge: true }
    );

    // ✅ Redirect immediately (do NOT stay on callback URL)
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?drive=connected`);

  } catch (err) {
    console.error("Drive callback error:", err);
    res.status(500).json({ error: "Drive connection failed" });
  }
};


/* ----------------------------------------------------
  3) CREATE FOLDER IN USER'S DRIVE
---------------------------------------------------- */
exports.createFolder = async (req, res) => {
  try {
    const uid = req.user.uid;      // from verifyUser middleware
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ error: "folderName is required" });
    }

    // Get user profile from Firestore
    const snap = await db.collection("photographers").doc(uid).get();

    if (!snap.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const data = snap.data();

    // Check if Drive is connected
    if (!data.googleDriveConnected || !data.driveTokens) {
      return res.status(400).json({
        error: "Please connect Google Drive first",
      });
    }

    const tokens = data.driveTokens;

    // Create OAuth client with saved tokens
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2 });

    // Create folder in Drive
    const folder = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
    });

    res.json({
      message: "Folder created successfully",
      folderId: folder.data.id,
    });
  } catch (err) {
    console.error("Create folder error:", err);
    res.status(500).json({ error: "Failed to create folder" });
  }
};

exports.listFolders = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db.collection("photographers").doc(uid).get();
    const tokens = snap.data().driveTokens;

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2 });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder'",
      fields: "files(id, name)",
    });

    res.json({ folders: response.data.files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listImages = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { folderId } = req.query;

    const snap = await db.collection("photographers").doc(uid).get();
    const tokens = snap.data().driveTokens;

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2 });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: "files(id, name, thumbnailLink)",
    });


    res.json({ images: response.data.files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.uploadImage = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { folderId } = req.body;

    if (!req.file || !folderId) {
      return res.status(400).json({ error: "Missing file or folderId" });
    }

    // Get saved Drive tokens
    const snap = await db.collection("photographers").doc(uid).get();
    const tokens = snap.data().driveTokens;

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2 });

    // 🔥 Convert buffer → readable stream (THIS FIXES YOUR ERROR)
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: req.file.mimetype,
        body: bufferStream,   // ✅ STREAM, NOT BUFFER
      },
    });

    res.json({
      message: "Image uploaded",
      fileId: response.data.id,
    });
  } catch (err) {
    console.error("UPLOAD ERROR FULL DETAILS:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.streamImage = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { fileId } = req.params;

    const snap = await db.collection("photographers").doc(uid).get();
    const tokens = snap.data().driveTokens;

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2 });

    const stream = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader("Content-Type", "image/jpeg");
    stream.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.shareFolder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { folderId, days } = req.body; // Expect 'days' in body

    if (!folderId) {
      return res.status(400).json({ error: "folderId required" });
    }

    // Calculate expiry date if days provided
    let expiresAt = null;
    if (days && parseInt(days) > 0) {
      const date = new Date();
      date.setDate(date.getDate() + parseInt(days));
      expiresAt = date;
    }

    // Check if already shared
    const snapshot = await db.collection("albums")
      .where("driveFolderId", "==", folderId)
      .where("ownerUid", "==", uid)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();

      // Update expiry if user is re-sharing or changing settings with a new date
      if (expiresAt) {
        await db.collection("albums").doc(doc.id).update({ expiresAt });
      }

      return res.json({ shareToken: data.shareToken });
    }

    // Create new share
    const shareToken = uuidv4();
    await db.collection("albums").add({
      driveFolderId: folderId,
      ownerUid: uid,
      shareToken: shareToken,
      expiresAt: expiresAt, // Store expiry date
      createdAt: new Date()
    });

    res.json({ shareToken });
  } catch (err) {
    console.error("Share folder error:", err);
    res.status(500).json({ error: "Failed to share folder" });
  }
};

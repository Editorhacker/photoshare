const { db } = require("../config/firebase");
const { getDriveClientWithTokens } = require("../service/drive.service");

exports.listPublicPhotos = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const { pageToken } = req.query;

    // 1) Find album by shareToken
    const snap = await db
      .collection("albums")
      .where("shareToken", "==", shareToken)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    const albumDoc = snap.docs[0];
    const album = albumDoc.data();

    // Check Expiration
    if (album.expiresAt) {
      const now = new Date();
      // Firestore timestamp to JS Date
      const expires = album.expiresAt.toDate ? album.expiresAt.toDate() : new Date(album.expiresAt);
      if (now > expires) {
        return res.status(410).json({ message: "This gallery link has expired." });
      }
    }

    const folderId = album.driveFolderId;
    const ownerUid = album.ownerUid;

    // 2) Get owner's Drive tokens
    const userSnap = await db
      .collection("photographers")
      .doc(ownerUid)
      .get();

    const userData = userSnap.data();

    if (!userData?.driveTokens) {
      return res.status(403).json({ message: "Drive not connected" });
    }

    const drive = await getDriveClientWithTokens(userData.driveTokens);

    // 3) List files from Drive
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageSize: 50,
      pageToken: pageToken || undefined,
    });

    const photos = response.data.files.map(f => ({
      fileId: f.id,
      name: f.name,
      mimeType: f.mimeType,
      viewUrl: `/api/public/view/${f.id}?shareToken=${shareToken}`
 // secure endpoint
    }));

    res.json({
      photos,
      nextPageToken: response.data.nextPageToken || null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.streamPublicPhoto = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { shareToken } = req.query;

    if (!shareToken) {
      return res.status(400).json({ message: "Missing shareToken" });
    }

    // 1️⃣ Find album by shareToken
    const snap = await db
      .collection("albums")
      .where("shareToken", "==", shareToken)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ message: "Invalid gallery link" });
    }

    const album = snap.docs[0].data();
    const ownerUid = album.ownerUid;

    // 2️⃣ Get owner tokens
    const userSnap = await db
      .collection("photographers")
      .doc(ownerUid)
      .get();

    if (!userSnap.exists || !userSnap.data().driveTokens) {
      return res.status(403).json({ message: "Drive not connected" });
    }

    const drive = await getDriveClientWithTokens(userSnap.data().driveTokens);

    // 3️⃣ Stream image
    const driveRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");

    driveRes.data.pipe(res);

  } catch (err) {
    console.error("Public stream error:", err.message);
    res.status(500).json({ error: "Failed to stream image" });
  }
};

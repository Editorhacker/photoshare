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
      viewUrl: `/api/public/view/${f.id}` // secure endpoint
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

    // Find which album this belongs to
    const albumsSnap = await db.collection("albums").get();

    let ownerUid = null;

    for (const doc of albumsSnap.docs) {
      const album = doc.data();
      if (album.ownerUid) {
        ownerUid = album.ownerUid;
        break;
      }
    }

    if (!ownerUid) {
      return res.status(404).json({ message: "Image owner not found" });
    }

    // Get owner's tokens
    const userSnap = await db
      .collection("photographers")
      .doc(ownerUid)
      .get();

    const userData = userSnap.data();
    const drive = await getDriveClientWithTokens(userData.driveTokens);

    const driveRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");

    driveRes.data.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to stream image" });
  }
};

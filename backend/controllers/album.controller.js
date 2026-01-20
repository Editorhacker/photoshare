const { db } = require("../config/firebase");
const { getDriveClientWithTokens } = require("../service/drive.service");
const { google } = require("googleapis");

exports.listPhotosFromDrive = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { pageToken } = req.query;

    // 1) Get album doc (only folder ID stored)
    const albumSnap = await db.collection("albums").doc(albumId).get();

    if (!albumSnap.exists) {
      return res.status(404).json({ message: "Album not found" });
    }

    const album = albumSnap.data();
    const folderId = album.driveFolderId;

    // 2) Get photographer's Drive tokens
    const userSnap = await db.collection("photographers")
      .doc(req.user.uid)
      .get();

    const userData = userSnap.data();

    if (!userData?.driveTokens) {
      return res.status(403).json({ message: "Google Drive not connected" });
    }

    const drive = await getDriveClientWithTokens(userData.driveTokens);

    // 3) List files in the folder (paginated)
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageSize: 50,
      pageToken: pageToken || undefined,
    });

    // Return safe metadata only (NO Drive links)
    const photos = response.data.files.map(f => ({
      fileId: f.id,
      name: f.name,
      mimeType: f.mimeType,
      viewUrl: `/api/albums/view/${f.id}` // YOUR secure endpoint
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



exports.streamPhotoFromDrive = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get photographer tokens
    const userSnap = await db.collection("photographers")
      .doc(req.user.uid)
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

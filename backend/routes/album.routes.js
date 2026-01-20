const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const {
  listPhotosFromDrive,
  streamPhotoFromDrive
} = require("../controllers/album.controller");

const router = express.Router();

// List images in album (paginated)
router.get("/:albumId/photos", verifyUser, listPhotosFromDrive);

// Stream single image securely
router.get("/view/:fileId", verifyUser, streamPhotoFromDrive);

module.exports = router;

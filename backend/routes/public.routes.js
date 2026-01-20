const express = require("express");
const {
  listPublicPhotos,
  streamPublicPhoto
} = require("../controllers/public.controller");

const router = express.Router();

// List photos via public link
router.get("/:shareToken/photos", listPublicPhotos);

// Stream single image via public link
router.get("/view/:fileId", streamPublicPhoto);

module.exports = router;

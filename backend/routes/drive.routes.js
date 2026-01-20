

const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const verifyUser = require("../middleware/verifyUser");
const {
  connectDrive,
  driveCallback,
  createFolder,
  listFolders,
  listImages,
  uploadImage,
  streamImage,
  shareFolder
} = require("../controllers/drive.controller");

const router = express.Router();

router.get("/connect", verifyUser, connectDrive);
router.get("/callback", driveCallback);
router.post("/create-folder", verifyUser, createFolder); // 🔥 THIS MUST EXIST
router.post("/share-folder", verifyUser, shareFolder); // 🔥 NEW ROUTE

router.get("/list-folders", verifyUser, listFolders);
router.get("/list-images", verifyUser, listImages);

router.post(
  "/upload-image",
  verifyUser,
  upload.single("image"),
  uploadImage
);

router.get("/image/:fileId", verifyUser, streamImage);


module.exports = router;

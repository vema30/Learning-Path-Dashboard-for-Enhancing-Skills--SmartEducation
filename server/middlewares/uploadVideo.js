const multer = require("multer");
const path = require("path");

// Multer Storage Configuration
const storage = multer.memoryStorage(); // ✅ Use memory storage for Cloudinary

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only videos are allowed."), false);
  }
};

// Multer Upload Config
const uploadVideo = multer({
  storage: storage, // ✅ Using memoryStorage instead of disk
  fileFilter: fileFilter,
});

module.exports = uploadVideo;

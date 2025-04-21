const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) options.height = height;
  if (quality) options.quality = quality;
  options.resource_type = "auto";

  // Ensure temp directory exists
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);

  try {
    // Move file to temp path
    await file.mv(tempPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, options);

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return result;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

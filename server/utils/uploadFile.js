const fs = require("fs");
const cloudinary = require('cloudinary').v2;

exports.uploadFileToCloudinary = async (file, folder, quality) => {
    const options = { resource_type: "auto", folder };
    if (quality) options.quality = quality;
  
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, options);
      console.log("✅ Cloudinary Upload Success:", result.secure_url);
      return result;
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      throw error;
    }
  };
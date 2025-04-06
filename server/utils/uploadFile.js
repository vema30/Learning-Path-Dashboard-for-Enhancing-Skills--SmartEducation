const cloudinary = require('cloudinary').v2;

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
    try {
        if (!file || !file.tempFilePath) {
            throw new Error("Invalid file input. Make sure the file is properly uploaded.");
        }

        const options = { folder };
        if (height) options.height = height;
        if (quality) options.quality = quality;
        options.resource_type = "auto"; // Supports both images and videos

        console.log("📤 Uploading file to Cloudinary:", file.tempFilePath);
        const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, options);
        
        console.log("✅ Cloudinary Upload Success:", uploadResponse.secure_url);
        return uploadResponse;
    } catch (error) {
        console.error("❌ Error uploading to Cloudinary:", error.message);
        throw error;
    }
};

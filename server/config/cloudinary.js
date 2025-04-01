const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzn3cqfdl',
            api_key: process.env.CLOUDINARY_API_KEY || '618453334731832',
            api_secret: process.env.CLOUDINARY_API_SECRET || '7Rd3uSyw2SbbcqOE8C48VBKpY1M',
        });
    } catch (error) {
        console.log("Error connecting to Cloudinary:", error);
    }
};

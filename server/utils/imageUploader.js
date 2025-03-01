const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file,folder,height,quality) => {
    try {
        const options={folder:folder,transformation:[{height:height,quality:quality}]};
        options.resource_type="auto";  
        const result = await cloudinary.uploader.upload(file,options);
         
        return result;
    } catch (error) {
        console.error("Error in uploading image to cloudinary:", error);
        return null;
    }
};
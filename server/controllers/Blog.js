const fs = require('fs');
const path = require('path');
const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const mediaFile = req.files?.mediaFile || null;

    console.log("mediaFile", mediaFile);

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    let mediaUrl = null;

    if (mediaFile) {
      // Ensure uploads directory exists
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // Create a unique file name
      const fileExtension = path.extname(mediaFile.name); // example: ".webp"
      const baseName = path.basename(mediaFile.name, fileExtension).replace(/\s+/g, '-');
      const uniqueFilename = `${Date.now()}-${baseName}${fileExtension}`;

      const uploadPath = path.join(uploadDir, uniqueFilename);

      // Move the uploaded file to the uploads folder
      await mediaFile.mv(uploadPath);

      // Set media URL correctly
      mediaUrl = `/uploads/${uniqueFilename}`;
    }

    // Create and save the blog post
    const newBlog = new Blog({
      title,
      content,
      author: author || "Admin",
      mediaUrl, // ✅ Now this will be a proper URL string
    });

    await newBlog.save();

    // Success response
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const express = require("express");
const Blog = require("../models/Blog");  // Import your Blog model
const upload = require("../middlewares/upload"); 
const { auth, isAdmin, isInstructor } = require("../middlewares/auth");
 

const router = express.Router();

// Controller functions for blog routes
const { createBlog } = require("../controllers/Blog");
router.post("/",createBlog);
// Create a new blog post
// router.post("/", upload.single("media"), async (req, res) => {
//     try {
//       const { title, content, author } = req.body;
//       const mediaFile = req.file ? req.file.filename : null;
//       console.log("hey bro i am in media")
  
//       // Check if the required fields are provided
//       if (!title || !content) {
//         return res.status(400).json({ success: false, message: "Title and content are required" });
//       }
  
//       // Log the uploaded file for debugging
//       console.log("Uploaded file details:", req.file);
  
//       // Create a new blog entry
//       const newBlog = new Blog({
//         title,
//         content,
//         author: author || "Admin", // Default author if not provided
//         mediaUrl: mediaFile ? `/uploads/${mediaFile}` : null, // Store the media URL if a file was uploaded
//       });
  
//       // Save the new blog to the database
//       await newBlog.save()
    
  
//       console.log("newBlog",newBlog);
//       // Respond with success
//       return res.status(201).json({
//         success: true,
//         message: "Blog created successfully",
//         data: {
//           title: newBlog.title,
//           content: newBlog.content,
//           author: newBlog.author,
//           mediaUrl: newBlog.mediaUrl,
//         },
//       });
//     } catch (error) {
//       console.error("Error creating blog:", error);
//       return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
//   });
  
  
// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts" });
  }
});

// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog post" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post" });
  }
});
router.put("/:id",async (req, res) => {
  try {
    const { title, content, author, mediaUrl } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author, mediaUrl },
      { new: true, runValidators: true } // Return updated document + validate
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog" });
  }
});

module.exports = router;

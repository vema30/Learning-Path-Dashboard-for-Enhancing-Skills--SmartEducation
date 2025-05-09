const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const {auth} = require("./middlewares/auth");
const stringSimilarity = require('string-similarity');
const QuizCategory = require('./models/QuizCategory');
// Config
require("dotenv").config();
const PORT = process.env.PORT || 4000;
  // This should be added before defining your routes

// Database and Cloudinary
const dataBaseConnection = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Models
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Routes
const categoryRoutes = require("./routes/categoryRoutes");
const testRoutes = require("./routes/testRoutes");
const quizRoutes=require("./routes/quizRoutes")
const testRoute=require("./routes/test")
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

// Connect database
dataBaseConnection();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: "*", // 🚫 NOT valid when credentials: true
 
}));
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/videos", express.static(path.join(__dirname, "uploads/videos")));

// Connect Cloudinary
cloudinaryConnect();

// Route Mounting
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/test", testRoutes);
app.use("/api/test", quizRoutes);
app.use("/api/test", testRoute);
app.use("/api/test", categoryRoutes);

app.get('/categories1', async (req, res) => {
	console.log("GET /categories1 hit");
	try {
	  const categories = await QuizCategory.find({});
	  res.json({ categories });
	} catch (err) {
	  console.error("Error fetching categories:", err);
	  res.status(500).json({ message: 'Server Error' });
	}
  });
  
//.log("fdsvcx",categoryRoutes);

// Default Route
app.get("/", (req, res) => {
  console.log("Root route hit");
  return res.json({
    success: true,
    message: `Your server is up and running on port ${PORT}`,
  });
});

// Multer setup for blog image uploads
//const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.delete('/api/posts/:id', async (req, res) => {
	try {
	  const post = await Post.findById(req.params.id);
  
	  if (!post) {
		return res.status(404).json({ message: 'Post not found' });
	  }
  
	  // Only the instructor who created the post can delete it
	//   if (req.user.role !== 'Instructor' || post.author.toString() !== req.user._id) {
	// 	return res.status(403).json({ message: 'Not authorized to delete this post' });
	//   }
  
	  await post.deleteOne();
	  res.status(200).json({ message: 'Post deleted successfully' });
  
	} catch (error) {
	  console.error('Delete error:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });
// Blog API Routes
app.post('/api/posts', upload.single('image'), async (req, res) => {
	try {
	  const { title, content } = req.body;
	  const image = req.file ? req.file.path : null;
   console.log(image);
	  const post = new Post({ title, content, image });
	  await post.save();
  
	  res.status(200).json(post);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: "Post creation failed", details: err.message });
	}
  });
  

  app.get("/api/posts", async (req, res) => {
	try {
	  const posts = await Post.find().sort({ createdAt: -1 }); // Sort posts by creation date in descending order
	  res.json(posts); // Return the posts as a JSON response
	} catch (e) {
	  console.log("Error in fetching posts:", e.error); // Handle any errors in fetching posts
	}
  });
  

  app.post("/api/posts/:postId/comments", async (req, res) => {
	const { text, parentId, userName } = req.body;  // Destructure text, parentId, and userName from the request body
  
	if (!text || !userName) {
	  return res.status(400).json({ message: "Text and userName are required" });
	}
  
	try {
	  const newComment = new Comment({
		postId: req.params.postId,   // Use postId from URL params
		text,
		parentId: parentId || null,  // Default to null if no parentId
		userName,                    // Use the userName passed from the frontend
	  });
  
	  const savedComment = await newComment.save();
	  res.status(201).json(savedComment);  // Return the saved comment
	} catch (error) {
	  console.error("Error saving comment:", error);
	  res.status(500).json({ message: "Error saving comment" });
	}
  });
  

app.get("/api/posts/:id/comments", async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id });
  res.json(comments);
});



app.post('/api/posts/:postId/like', async (req, res) => {
    console.log('Request received to like post:', req.params.postId); // Debug log

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Using a simple timestamp for the like ID
        const likeId = Date.now().toString(); // Unique identifier for each like
        if (post.likes.includes(likeId)) {
            return res.status(400).json({ message: 'You already liked this post' });
        }

        // Add the like
        post.likes.push(likeId);
        await post.save();

        console.log('Post liked successfully:', post._id); // Debug log
        return res.status(200).json({ message: 'Post liked successfully' });
    } catch (err) {
        console.error('Error in liking post:', err); // Debug log for errors
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});




app.get('/search', async (req, res) => {
	try {
		console.log("r",req.query)
	  const { query } = req.query;
	  if (!query) return res.status(400).json({ message: 'Query required' });
  
	  const posts = await Post.find({});
	  const scoredPosts = posts.map(post => {
		const score = stringSimilarity.compareTwoStrings(query, post.title + ' ' + post.content);
		return { ...post.toObject(), score };
	  });
  
	  const filtered = scoredPosts
		.filter(post => post.score > 0.2)
		.sort((a, b) => b.score - a.score);
  
	  res.json(filtered);
	} catch (error) {
	  console.error('Search error:', error);
	  res.status(500).json({ message: 'Server error' });
	}
  });
 
  
  
  app.post('/api/posts/:postId/comments/:commentId/reply', async (req, res) => {
	const { text, userId } = req.body;
	const { postId, commentId } = req.params;
  
	try {
	  // Find the comment being replied to
	  const parentComment = await Comment.findById(commentId);
	  if (!parentComment) {
		return res.status(404).json({ message: 'Comment not found' });
	  }
  
	  // Create the reply (child comment)
	  const reply = new Comment({
		postId,
		text,
		parentId: commentId, // Link to parent comment
		userId,
	  });
  
	  await reply.save();
	  res.status(200).json(reply);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Failed to reply' });
	}
  });
  

// Start Server
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

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
const cloudinary = require('cloudinary').v2;
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

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/videos", express.static(path.join(__dirname, "uploads/videos")));
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Connect Cloudinary
cloudinaryConnect();

// Route Mounting
// const { OpenAI } = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });



  
// app.post('/api/chat', async (req, res) => {
// 	const { message } = req.body; // Chat message from user
  
// 	try {
// 	  const response = await openai.chat.completions.create({
// 		model: 'gpt-3.5-turbo',
// 		messages: [{ role: 'user', content: message }],
// 	  });
  
// 	  const chatResponse = response.choices[0].message.content;
// 	  res.json({ message: chatResponse });
// 	} catch (error) {
// 	  console.error(error);
// 	  res.status(500).json({ error: 'Failed to get response from ChatGPT' });
// 	}
//   });
  
const Course = require("./models/Course");
const CourseProgress = require("./models/CourseProgress");

// GET course progress percentage for a user by course ID
app.get("/user/course-progress/:courseId",async (req, res) => {
	//console.log("GET /user/course-progress/:courseId hit");
	//const courseId="681f9903d8677ba2fcd7d050"
 //const userId = req.user.id;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: {
        path: "subSections",
        select: "_id"
      }
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const allSubSectionIds = course.sections.flatMap((section) =>
      section.subSections.map((sub) => sub._id.toString())
    );

    const totalCount = allSubSectionIds.length;

    if (totalCount === 0) {
      return res.status(200).json({ progressPercentage: 0 });
    }

    const progress = await CourseProgress.findOne({  courseId });

    if (!progress || !progress.completedLectures.length) {
      return res.status(200).json({ progressPercentage: 0 });
    }

    const uniqueCompleted = [...new Set(progress.completedLectures.map(id => id.toString()))];
    const validCompleted = uniqueCompleted.filter(id => allSubSectionIds.includes(id));

    const completedCount = validCompleted.length;
    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    return res.status(200).json({
      progressPercentage,
      completedCount,
      totalCount
    });

  } catch (error) {
    console.error("Error fetching course progress:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/hey", async (req, res) => {
	console.log("hey");
	res.send("hey");
  });
  


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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/images"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

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
  const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/posts',  async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Upload buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'posts' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Cloudinary upload failed' });
        }

        // Save post with Cloudinary URL
        const post = new Post({
          title,
          content,
          image: result.secure_url,
        });

        await post.save();
        return res.status(200).json(post);
      }
    );

    // Pipe the file buffer to the upload stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'posts' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Cloudinary upload failed' });
        }
        
        // Save post with Cloudinary URL
        const post = new Post({
          title,
          content,
          image: result.secure_url,
        });

        post.save().then(() => {
          res.status(200).json(post);
        });
      }
    );

    stream.end(req.file.buffer);

  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ error: "Post creation failed", details: err.message });
  }
});

// Blog API Routes
// app.post('/api/posts',upload.single('image'),   async (req, res) => {
// 	console.log("hey");
// 	console.log("req.body",req.body);
// 	console.log("req.file",req.file);
// 	try {
// 	  const { title, content } = req.body;
// 	  const image = req.file ? req.file.path : null;
//    console.log(image);
// 	  const post = new Post({ title, content, image });
// 	  await post.save();
  
// 	  res.status(200).json(post);
// 	} catch (err) {
// 	  console.error(err);
// 	  res.status(500).json({ error: "Post creation failed", details: err.message });
// 	}
//   });
  

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
	  const { query } = req.query;
	  if (!query) return res.status(400).json({ message: 'Query required' });
  
	  const posts = await Post.find({});
	  if (!posts.length) return res.status(200).json({ message: 'No posts available' });
  
	  const scoredPosts = posts.map(post => {
		const score = stringSimilarity.compareTwoStrings(
		  query.toLowerCase(),
		  (post.title + ' ' + post.content).toLowerCase()
		);
		return { ...post.toObject(), score };
	  });
  
	  scoredPosts.forEach(p => console.log(`Score for "${p.title}":`, p.score));
  
	  const filtered = scoredPosts
		.filter(post => post.score > 0.05)
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
